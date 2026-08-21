'use client'

import { useEffect, useRef, useState, type CSSProperties, type TransitionEvent } from 'react'
import { EMBER_WASH } from '@/lib/palettes'
import { BracketLabel } from '@/components/ui/BracketLabel'
import type { ChannelsContent } from '@/lib/types'

// Figma 2796:9847 (desktop) / 2807:10160 (mobile) — "The Channels" on /branding. Dark ground,
// label/heading, then the channels.
//
// The two frames disagree on how you get between them, so the markup carries both: md+ shows one
// card at a time with the two pixel arrows sitting in a row UNDER it, pushed to the right edge
// (3246:1671), and the phone frame drops the arrows entirely and lays all three out in a row you
// swipe, the active one centred with its neighbours peeking 8px past the gutters. That is a
// scroll-snap strip: no JS, and the thumb is already the control the mobile frame implies by having
// no other one.
//
// The arrows are the same glyph the About carousel uses, so /arrow_pixel.svg is reused as a mask
// rather than copied and recoloured: the file is pink (#FF6D6A) because that is what the carousel
// wants, and this frame draws it in warm grey. Same one-asset-many-tints trick as the hero pills.
//
// The scanline texture over the ground — /branding/overlay.webp, the frame's own export re-encoded
// (Figma ships it as a 4096px 10.9MB JPEG). Full-bleed and object-cover, as the frame has it.
//
// ponytail: index state, two buttons and one translated track — no carousel library. Embla was on
// the table; it would have bought drag, which the phone already gets from the browser's own
// scroll-snap, and snapping, which one transform on a 3-item ring does not need.

// 0 0 8px + 1px 8px 8px, both rgba(21,20,20,0.65) — Figma's own two-layer drop shadow
const CARD_SHADOW = '0 0 8px 0 rgba(21,20,20,0.65), 1px 8px 8px 0 rgba(21,20,20,0.65)'

// Figma sets the ground texture at 1%, and the client asked for whatever actually shows instead. 1%
// of a light texture over #292624 lands ~2 of 255 — under one step of 8-bit colour on most panels,
// which is why it read as missing. 6% is about the lowest that reads as texture rather than as
// nothing. CompoundEffect carries the same number so the two dark sections match.
export const OVERLAY_OPACITY = 0.01

// Where the ground goes from the cream above to this section's dark, both measured as the section's
// top edge in viewport heights: the sweep starts once that edge is START up the window and is done
// SWEEP of a viewport later — so here, from three quarters down to a third up.
//
// It deliberately does not start at 1.0, i.e. the moment the edge appears: down there the whole
// thing played out in the bottom sliver of the screen and was over before it read as anything
// (client note). Starting late puts it across the middle of the window instead.
//
// The easing stays front-loaded on purpose. The section's own copy is near-white, so the ground has
// to be most of the way dark early — it is 75% there by the time the sweep is half over.
const START = 0.75
const SWEEP = 0.4

const ARROW_TINT = '#867A72' // color/neutral-variant/40 — the frame's own arrow colour

function Arrow({ label, onClick, back = false }: { label: string; onClick: () => void; back?: boolean }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className="shrink-0 cursor-pointer transition-opacity hover:opacity-70"
    >
      {/* 27.429 x 24 in the frame — the same glyph the carousel draws at 32 x 28, masked so the
          one file can be pink there and warm grey here. */}
      <span
        aria-hidden
        className={`block h-6 w-[27.429px] ${back ? 'rotate-180' : ''}`}
        style={
          {
            backgroundColor: ARROW_TINT,
            maskImage: 'url(/arrow_pixel.svg)',
            maskSize: 'contain',
            maskRepeat: 'no-repeat',
            maskPosition: 'center',
            WebkitMaskImage: 'url(/arrow_pixel.svg)',
            WebkitMaskSize: 'contain',
            WebkitMaskRepeat: 'no-repeat',
            WebkitMaskPosition: 'center',
          } as CSSProperties
        }
      />
    </button>
  )
}

export function Channels({ content }: { content: ChannelsContent }) {
  const count = content.slides.length
  const ground = useRef<HTMLElement>(null)

  // The ground crossfade. Writes a CSS custom property straight onto the section rather than going
  // through state: this runs once a frame while the section is in reach, and re-rendering nine
  // cards for a background colour would be the whole frame budget.
  //
  // Plain window scroll, not Lenis' event. Lenis scrolls the window itself, so this fires either
  // way, and it keeps working on the pass where getLenis() is null — under prefers-reduced-motion,
  // which is also the one case that opts out entirely and leaves the section flat dark.
  useEffect(() => {
    const el = ground.current
    if (!el) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    let raf = 0
    const paint = () => {
      raf = 0
      const edge = el.getBoundingClientRect().top / window.innerHeight
      const t = Math.min(Math.max((START - edge) / SWEEP, 0), 1)
      el.style.setProperty('--ground', String(1 - (1 - t) ** 2)) // ease-out: dark arrives early
    }
    // coalesced to one paint per frame — scroll fires far more often than that
    const queue = () => {
      if (!raf) raf = requestAnimationFrame(paint)
    }

    paint()
    window.addEventListener('scroll', queue, { passive: true })
    window.addEventListener('resize', queue)
    return () => {
      window.removeEventListener('scroll', queue)
      window.removeEventListener('resize', queue)
      if (raf) cancelAnimationFrame(raf)
    }
  }, [])

  // Infinite in one direction: the slides are laid out three times over and the track starts on the
  // middle copy, so "next" off the last channel keeps travelling right into a real card instead of
  // rewinding two widths to the left. Once the slide has landed, the position is snapped back into
  // the middle copy with the transition off — same pixels, so nothing is visible, and there is
  // always another copy to walk into whichever way you go.
  // The two outer copies are display:none below md. The phone does not use the track at all (it
  // swipes its own scroll container), and three cards is the strip the mobile frame draws.
  const [pos, setPos] = useState(count)
  const [snap, setSnap] = useState(false)
  const step = (by: number) => setPos((p) => p + by)

  // one frame with transitions off is all the snap needs; re-arm straight after
  useEffect(() => {
    if (!snap) return
    const id = requestAnimationFrame(() => setSnap(false))
    return () => cancelAnimationFrame(id)
  }, [snap])

  const onLanded = (e: TransitionEvent<HTMLDivElement>) => {
    if (e.target !== e.currentTarget || e.propertyName !== 'transform') return
    if (pos >= count && pos < count * 2) return
    setSnap(true)
    setPos(((pos % count) + count) % count + count)
  }

  return (
    <section
      ref={ground}
      aria-label={content.label}
      aria-roledescription="carousel"
      // Figma frame: p 112, blocks 48 apart. Mobile (2807:10160): px 16 / py 48, blocks 40 apart,
      // and it closes the section above on a keyline.
      //
      // .ground-sweep is the scroll-driven background (styles.css); the effect above drives it.
      className="ground-sweep relative w-full overflow-hidden border-t border-[#544D49] px-4 py-12 md:p-28"
    >
      {/* Decorative, so empty alt and a plain <img>: it is a static file in /public at a fixed
          opacity, with nothing for next/image to choose between. */}
      <img
        src="/branding/overlay.webp"
        alt=""
        aria-hidden
        className="pointer-events-none absolute inset-0 size-full max-w-none object-cover"
        style={{ opacity: OVERLAY_OPACITY }}
      />

      <div className="relative mx-auto flex w-full max-w-[1216px] flex-col items-center gap-10 md:gap-12">
        <div className="flex w-full flex-col items-center gap-6 text-center md:gap-8">
          <BracketLabel className="mx-auto w-52 text-[#FF6D6A] md:w-[360px]">
            {content.label}
          </BracketLabel>
          {/* 876px is Figma's own width, and it is what puts the break after "actually" */}
          <h2 className="max-w-[876px] font-display text-[40px] font-normal leading-[1.1] tracking-[-1px] text-[#FFFCF9] md:text-[64px]">
            {content.heading}
          </h2>
        </div>

        {/* 1088 is the card's own width in the frame, inside the section's 1216 column; the arrow
            row is that same width, so the arrows land on the card's right edge. 32 between the two.
            Mobile has neither — the strip runs the full gutter-to-gutter width. */}
        <div className="flex w-full flex-col gap-8 md:max-w-[1088px]">
          {/* The viewport. -mx-4 cancels the section's gutters so the neighbours can show past them,
              px-4 puts them back inside, and each card is a viewport wide between them. On a phone
              this is the scroll surface itself — swipe, snap, and the browser's own inertia, no JS.
              At md+ it stops scrolling and clips instead, and the arrows slide the track under it.
              The scrollbar is hidden: this is a swipe surface, not a pane. */}
          <div className="-mx-4 min-w-0 snap-x snap-mandatory overflow-x-auto px-4 [scrollbar-width:none] md:mx-0 md:snap-none md:overflow-hidden md:px-0 [&::-webkit-scrollbar]:hidden">
            {/* Every card is in the DOM at every width — hiding all but the active one at md+ was
                what let each card size to its own copy, so the frame jumped height between
                channels. In one flex row they stretch to the tallest instead, and the arrows only
                have to move the track. --i is the transform's input; styles.css only applies it at
                md+, where the phone's scroll is off and would otherwise fight it. */}
            <div
              className={`channel-track flex gap-2 md:gap-12 ${snap ? 'is-snapping' : ''}`}
              style={{ '--i': pos } as CSSProperties}
              onTransitionEnd={onLanded}
            >
              {[0, 1, 2].flatMap((copy) =>
                content.slides.map((slide) => (
                  <article
                    key={`${copy}-${slide.title}`}
                    aria-hidden={copy !== 1 || undefined}
                    // px 16 / py 40 on the phone, px 40 / py 64 on desktop. The gap between cards is real at
                    // every width now — with the cards flush the slide read as one long sheet moving
                    // rather than three objects passing.
                    className={`w-[calc(100vw-2rem)] shrink-0 snap-center flex-col items-center gap-10 border border-[#3C3734] bg-[rgba(21,20,20,0.32)] px-4 py-10 md:w-full md:flex-row md:justify-center md:gap-20 md:px-10 md:py-16 ${
                      copy === 1 ? 'flex' : 'hidden md:flex'
                    }`}
                    style={{ boxShadow: CARD_SHADOW }}
                  >
                    <div className="flex w-full flex-1 flex-col items-start gap-5">
                      {/* Figma draws an arrow-up-right button beside the title at opacity 0 — a link
                          that does not exist yet, so it is not rendered. Same call as the
                          paid-advertising panels. */}
                      <p className="w-full font-sans text-[32px] leading-[1.25] tracking-[-0.5px] text-[#FCF7F3] md:text-[40px]">
                        {slide.title}
                      </p>
                      {/* New Spirit Medium Condensed — heavier than the paragraph under it, not bold */}
                      <p className="w-full font-sans text-xl font-medium leading-[1.25] tracking-[-0.5px] text-[#FCF7F3] md:text-2xl md:leading-[1.4]">
                        {slide.lede}
                      </p>
                      <p className="w-full font-display text-base font-normal leading-[1.25] tracking-[0.25px] text-[#E7DCD4] md:text-xl">
                        {slide.body}
                      </p>
                    </div>

                    {/* 297px on the phone frame, 400 fixed at md+. The rule between the stats and the
                        quote is a border, not the 1px svg Figma exports for it. */}
                    <div
                      className="flex w-full max-w-[297px] shrink-0 flex-col gap-4 border border-[#292624] p-4 md:w-[400px] md:max-w-none md:p-6"
                      style={{ backgroundImage: EMBER_WASH }}
                    >
                      {slide.stats.map((stat) => (
                        <div
                          key={stat.label}
                          // the phone sets the figure beside its label; desktop stacks and centres
                          className="flex w-full items-center gap-4 md:flex-col md:gap-2 md:text-center"
                        >
                          <p className="shrink-0 font-sans text-[32px] leading-[1.25] tracking-[-0.5px] text-[#FCF7F3] md:text-[36px]">
                            {stat.value}
                          </p>
                          {/* Figma sets this nowrap at exactly the panel's inner width. Left to wrap
                              instead: one fallback-font glyph wider and nowrap would overflow the
                              card. */}
                          <p className="font-display text-xs font-normal leading-[1.25] tracking-[0.25px] text-[#D1C1B7] md:text-base">
                            {stat.label}
                          </p>
                        </div>
                      ))}

                      <p className="w-full border-t border-[#3C3734] pt-4 font-display text-xs font-normal leading-[1.25] tracking-[0.25px] text-[#9F9188] md:text-center md:text-sm">
                        {slide.quote}
                      </p>
                    </div>
                  </article>
                )),
              )}
            </div>
          </div>

          {/* px 8 in the frame, and the phone has no arrows at all */}
          <div className="hidden w-full justify-end gap-8 px-2 md:flex">
            <Arrow back label="Previous channel" onClick={() => step(-1)} />
            <Arrow label="Next channel" onClick={() => step(1)} />
          </div>
        </div>
      </div>
    </section>
  )
}
