'use client'

import { Fragment, useEffect, useRef, useState, type CSSProperties } from 'react'
import { EMBER_WASH } from '@/lib/palettes'
import { getLenis } from '@/lib/lenis'
import { BracketLabel } from '@/components/ui/BracketLabel'
import type { CompoundContent } from '@/lib/types'

// Figma 2767:9349 (desktop) / 2739:8985 (mobile) — "The Compound Effect" on /branding. Argument on
// the left, one phase card in the middle, and a vertical progress rail on the right that says which
// phase the card shows.
//
// The section takes the scroll while its phases play: as it settles into the middle of the viewport
// the page stops, each further scroll moves the card up to the next phase, and once the last one is
// reached the scroll is handed straight back. Scrolling up walks them in reverse and hands back at
// the first. Nothing is added to the layout to do it — no tall track, no padding, no sticky, no
// spacer. The section is exactly the height and shape it has always been.
//
// It works because Lenis owns scrolling for this app (SmoothScroll.tsx) and can simply be told to
// stop: while stopped it cancels every wheel and touch event it receives, so the page is genuinely
// frozen. A hand-rolled hijack cannot do this here — our own preventDefault on a wheel listener
// competes with Lenis for the same gesture rather than replacing it, which is why the page kept
// moving. Lenis also emits `virtual-scroll` BEFORE it checks whether it is stopped, so the deltas
// still arrive while the page is held, already normalised across a mouse wheel, a trackpad and a
// touch drag. One code path covers all three.
//
// Deliberately NOT covered: the keyboard, and the scrollbar. Space bar, Page Down, Home/End and a
// scrollbar drag scroll natively, past a stopped Lenis, so the section can never trap anyone — they
// leave on whatever phase it was showing, and the rail is still there to pick the rest. Under
// prefers-reduced-motion Lenis is never constructed, getLenis() is null, and the section falls back
// to the phone's list of all four phases: freezing the page is exactly the kind of motion that
// setting is asking us not to do.
//
// The phone frame has no rail and no picker: it centres the argument and then lists all four
// phases, tab and card, one under the other. So the pin, the rail and the sliding card are md+
// only — that is the mobile design, not a fallback.
//
// The rail's dots are two 28px svgs in Figma; they are a ring, a fill and a 4px dot, so they are
// CSS here rather than two more files in /public.
//
// Figma lays the same 1% scanline texture over this ground as "The Channels". Not rendered, same
// reason: 1% of it over #292624 is below one step of 8-bit colour.

// The section takes the scroll once its centre is within this much of the viewport's, and does not
// re-arm until it has left again — otherwise handing back at the last phase would immediately
// re-take the very next event.
const CATCH = 0.08

// Scroll to move one phase. Accumulated, because one trackpad flick or touch drag is dozens of
// small deltas where a mouse wheel is a handful of ~100s; the cooldown then swallows the tail of a
// flick so a single gesture cannot run the whole story.
const STEP = 140
const COOLDOWN = 450

const hardBreaks = (text: string) =>
  text.split('\n').map((line, i) => (
    <Fragment key={line}>
      {i > 0 && <br />}
      {line}
    </Fragment>
  ))

export function CompoundEffect({ content }: { content: CompoundContent }) {
  const section = useRef<HTMLElement>(null)
  const [active, setActive] = useState(0)
  const count = content.phases.length
  const last = count - 1

  // Refs, not state: these are read inside Lenis' own event callbacks, which are subscribed once.
  // Re-subscribing on every phase change would drop deltas mid-gesture.
  const current = useRef(0)
  const held = useRef(false)
  const armed = useRef(true)
  const travel = useRef(0)
  const steppedAt = useRef(0)

  const show = (i: number) => {
    current.current = i
    setActive(i)
  }

  useEffect(() => {
    const el = section.current
    const lenis = getLenis()
    // no Lenis => reduced motion, or not mounted yet. Either way the page is left alone; the CSS
    // falls back to listing every phase.
    if (!el || !lenis) return

    const desktop = () => window.matchMedia('(min-width: 72rem)').matches // md is 72rem, not 768

    const release = () => {
      held.current = false
      armed.current = false // stays disarmed until the section has left the catch window
      travel.current = 0
      lenis.start()
    }

    // Watches for the section arriving, and for it leaving after a hand-back. Runs on Lenis' own
    // scroll event, which fires once a frame while it eases.
    const watch = () => {
      if (held.current || !desktop()) return
      const box = el.getBoundingClientRect()
      const off = Math.abs(box.top + box.height / 2 - window.innerHeight / 2)
      const inside = off < window.innerHeight * CATCH

      if (!armed.current) {
        if (!inside) armed.current = true // left the window: ready to catch again
        return
      }
      if (!inside) return

      // Entering from below means the story is being read backwards, so it opens on the last phase.
      show(lenis.direction < 0 ? last : 0)
      held.current = true
      travel.current = 0
      // Stops where it is. No scrollTo to settle it dead centre: that is a jump the reader did not
      // ask for, and CATCH is tight enough that "where it is" already is the middle.
      lenis.stop()
    }

    // Every held gesture, already normalised by Lenis across wheel/trackpad/touch.
    const onGesture = ({ deltaY, event }: { deltaY: number; event: Event }) => {
      if (!held.current) return
      travel.current += deltaY
      if (Math.abs(travel.current) < STEP) return

      const dir = travel.current > 0 ? 1 : -1
      travel.current = 0
      if (event.timeStamp - steppedAt.current < COOLDOWN) return
      steppedAt.current = event.timeStamp

      const next = current.current + dir
      if (next < 0 || next > last) return release()
      show(next)
    }

    lenis.on('scroll', watch)
    lenis.on('virtual-scroll', onGesture)
    watch()

    return () => {
      lenis.off('scroll', watch)
      lenis.off('virtual-scroll', onGesture)
      // never leave the page frozen behind us — this unmounts on every route change
      if (held.current) lenis.start()
    }
  }, [last])

  return (
    <section
      ref={section}
      aria-label={content.label}
      // Figma frame: pl 112, pr 24 (the rail's labels carry their own inset), py 112, and it opens
      // on the same 1px keyline the hero closes with. Mobile (2739:8985): px 20, pt 48, pb 96.
      className="w-full border-t border-[#544D49] bg-[#292624] px-5 pt-12 pb-24 md:py-28 md:pr-6 md:pl-28"
    >
      <div className="mx-auto flex w-full max-w-[1304px] flex-col gap-12 md:flex-row md:items-center md:gap-16">
        {/* 538px is Figma's column. Centred on a phone, where the copy is the whole width; left
            against the card and rail once there is room for all three. Static the whole way
            through — only the card and the rail answer the scroll. */}
        <div className="flex w-full flex-col gap-6 text-center md:w-[538px] md:gap-8 md:text-left">
          <div className="flex flex-col gap-6">
            {/* Widest label on the site, hence the bigger travel box */}
            <BracketLabel className="mx-auto w-72 text-[#FF6D6A] md:mx-0 md:w-[460px]">
              {content.label}
            </BracketLabel>
            <h2 className="font-display text-[40px] font-normal leading-[1.1] tracking-[-1px] text-[#FFFCF9] md:text-[64px]">
              {content.heading.split('\n').map((line) => (
                <span key={line} className="block">
                  {line}
                </span>
              ))}
            </h2>
          </div>
          <p className="whitespace-pre-line font-sans text-xl leading-[1.25] text-[#F7F1EE] md:text-2xl">
            {content.body}
          </p>
        </div>

        {/* The rail — the vertical progress column Figma draws, and the picker for the card beside
            it. Desktop only: the phone frame lists every phase instead, so there is nothing left for
            it to choose. */}
        <ol className="order-2 hidden md:order-3 md:ml-auto md:flex md:w-auto md:flex-col md:gap-0 md:self-stretch">
          {content.phases.map((p, i) => {
            const selected = i === active
            return (
              <li key={p.period} className="flex shrink-0 md:flex-1">
                <button
                  type="button"
                  onClick={() => show(i)}
                  aria-current={selected ? 'step' : undefined}
                  // grow at md+ so the dot column is pinned to the rail's right edge on every row.
                  // Without it each label sizes to its own text and the dots zigzag.
                  className={`flex h-full cursor-pointer flex-col whitespace-nowrap font-display text-sm font-bold tracking-[-0.5px] transition-colors md:grow md:text-right ${
                    // the first and last labels sit level with their own dot, not centred in a
                    // quarter of the rail, so the column ends flush with the copy beside it
                    i === 0
                      ? 'md:justify-start md:py-1.5'
                      : i === last
                        ? 'md:justify-end md:py-1.5'
                        : 'md:justify-center'
                  } ${selected ? 'text-[#E7DCD4]' : 'text-[#9F9188] hover:text-[#E7DCD4]'}`}
                >
                  {p.period}
                </button>

                {/* 60px = the 28px dot plus Figma's 16px either side */}
                <div aria-hidden className="hidden w-[60px] flex-col items-center px-4 md:flex">
                  {/* The end caps have no connector AND no spacer — an empty flex-1 span would still
                      claim half the row and float the first and last dots away from their labels. */}
                  {i > 0 && <span className="w-[2px] flex-1 bg-[#3C3734]" />}
                  <span
                    className={`flex size-7 shrink-0 items-center justify-center rounded-full border-2 transition-colors ${
                      selected ? 'border-[#FF6D6A] bg-[#FF6D6A]' : 'border-[#3C3734]'
                    }`}
                  >
                    <span className="size-2 rounded-full bg-[#E7DCD4]" />
                  </span>
                  {i < last && <span className="w-[2px] flex-1 bg-[#3C3734]" />}
                </div>
              </li>
            )
          })}
        </ol>

        {/* 458px is Figma's column. Every phase is in the document at both sizes. At md+ .phase-stack
            lays them all in one grid cell and slides them vertically — the next phase rises into the
            window as the scroll advances, matching the direction the story is read in. That also
            makes them all the height of the tallest, so the frame does not resize between phases. On
            a phone it stays the stacked list the mobile frame draws. */}
        <div className="phase-stack order-3 flex w-full flex-col gap-4 md:order-2 md:w-[458px]">
          {content.phases.map((phase, i) => (
            <div
              key={phase.period}
              aria-hidden={i !== active || undefined}
              // The tab hugs its label and shares its card's top edge — three borders on the tab,
              // four on the card, so the seam between them stays 1px.
              className="flex w-full flex-col items-start"
              style={{ '--o': i - active } as CSSProperties}
            >
              <div
                className="border-x border-t border-[#3C3734] px-2 py-1"
                style={{ backgroundImage: EMBER_WASH }}
              >
                <p className="font-mono text-sm font-normal whitespace-nowrap uppercase leading-[1.4] tracking-[1px] text-[#FCF7F3] md:text-lg">
                  {phase.period}
                </p>
              </div>

              {/* grow so every card fills the shared cell — they hold different amounts of copy and
                  the frame around them should not change size as the phases step. */}
              <div className="flex w-full grow flex-col gap-3 border border-[#3C3734] bg-[rgba(21,20,20,0.32)] p-6">
                {/* A phase with no copy yet renders the tab and an empty card rather than inventing
                    a headline for it. Fill in mock/branding.ts as the copy lands. */}
                {phase.title && (
                  <p className="w-full font-sans text-[40px] leading-[1.25] tracking-[-0.5px] text-[#FCF7F3]">
                    {hardBreaks(phase.title)}
                  </p>
                )}
                {phase.body && (
                  <p className="w-full font-display text-xl font-normal leading-[1.25] tracking-[0.25px] text-[#E7DCD4] md:text-2xl">
                    {phase.body}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
