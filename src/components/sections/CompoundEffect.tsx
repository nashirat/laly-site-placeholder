'use client'

import { Fragment, useState } from 'react'
import { EMBER_WASH } from '@/lib/palettes'
import { BracketLabel } from '@/components/ui/BracketLabel'
import type { CompoundContent } from '@/lib/types'

// Figma 2767:9349 (desktop) / 2739:8985 (mobile) — "The Compound Effect" on /branding. Argument on
// the left, one phase card in the middle, and a vertical progress rail on the right that picks which
// phase the card shows.
//
// The phone frame has no rail and no picker: it centres the argument and then lists all four phases,
// tab and card, one under the other. So the rail is desktop-only and the cards are all rendered at
// both sizes — md+ just hides the three that are not current. One list, one set of markup, and the
// phases stay in the document on a phone where there is nothing to click them with.
//
// The rail's dots are two 28px svgs in Figma; they are a ring, a fill and a 4px dot, so they are
// CSS here rather than two more files in /public.
//
// Figma lays the same 1% scanline texture over this ground as "The Channels". Not rendered, same
// reason: 1% of it over #292624 is below one step of 8-bit colour.

const hardBreaks = (text: string) =>
  text.split('\n').map((line, i) => (
    <Fragment key={line}>
      {i > 0 && <br />}
      {line}
    </Fragment>
  ))

export function CompoundEffect({ content }: { content: CompoundContent }) {
  const [active, setActive] = useState(0)
  const last = content.phases.length - 1

  return (
    <section
      aria-label={content.label}
      // Figma frame: pl 112, pr 24 (the rail's labels carry their own inset), py 112, and it opens
      // on the same 1px keyline the hero closes with. Mobile (2739:8985): px 20, pt 48, pb 96.
      className="w-full border-t border-[#544D49] bg-[#292624] px-5 pt-12 pb-24 md:py-28 md:pr-6 md:pl-28"
    >
      <div className="mx-auto flex w-full max-w-[1304px] flex-col gap-12 md:flex-row md:items-center md:gap-16">
        {/* 538px is Figma's column. Centred on a phone, where the copy is the whole width; left
            against the card and rail once there is room for all three. */}
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
                  onClick={() => setActive(i)}
                  aria-current={selected ? 'step' : undefined}
                  // grow at md+ so the dot column is pinned to the rail's right edge on every row.
                  // Without it each label sizes to its own text and the dots zigzag.
                  className={`flex h-full flex-col whitespace-nowrap font-display text-sm font-bold tracking-[-0.5px] transition-colors md:grow md:text-right ${
                    // the first and last labels sit level with their own dot, not centred in a
                    // quarter of the rail, so the column ends flush with the copy beside it
                    i === 0 ? 'md:justify-start md:py-1.5' : i === last ? 'md:justify-end md:py-1.5' : 'md:justify-center'
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
                    className={`flex size-7 shrink-0 items-center justify-center rounded-full border-2 ${
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

        {/* 458px is Figma's column. Every phase is here; md+ leaves only the one the rail points at.
            The tab hugs its label and shares its card's top edge — three borders on the tab, four on
            the card, so the seam between them stays 1px. */}
        <div className="order-3 flex w-full flex-col gap-4 md:order-2 md:w-[458px] md:gap-0">
          {content.phases.map((phase, i) => (
            <div
              key={phase.period}
              className={`flex w-full flex-col items-start ${i === active ? '' : 'md:hidden'}`}
            >
              <div
                className="border-x border-t border-[#3C3734] px-2 py-1"
                style={{ backgroundImage: EMBER_WASH }}
              >
                <p className="font-mono text-sm font-normal whitespace-nowrap uppercase leading-[1.4] tracking-[1px] text-[#FCF7F3] md:text-lg">
                  {phase.period}
                </p>
              </div>

              <div className="flex w-full flex-col gap-3 border border-[#3C3734] bg-[rgba(21,20,20,0.32)] p-6">
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
