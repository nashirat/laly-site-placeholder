'use client'

import { useState } from 'react'
import { EMBER_WASH } from '@/lib/palettes'
import { BracketLabel } from '@/components/ui/BracketLabel'
import type { ChannelsContent } from '@/lib/types'

// Figma 2796:9847 (desktop) / 2807:10160 (mobile) — "The Channels" on /branding. Dark ground,
// label/heading, then the channels.
//
// The two frames disagree on how you get between them, so the markup carries both: md+ shows one
// card at a time with a pixel arrow either side (same arrow asset the About carousel uses —
// /arrow_pixel.svg is byte-for-byte the Figma export, left one just rotated), and the phone frame
// drops the arrows entirely and lays all three out in a row you swipe, the active one centred with
// its neighbours peeking 8px past the gutters. That is a scroll-snap strip: no JS, and the thumb is
// already the control the mobile frame implies by having no other one.
//
// Figma also lays a scanline texture over the ground at 1% opacity. Not rendered: 1% of a light
// texture over #292624 is under one step of 8-bit colour, so it would be a ~300KB asset for nothing.
//
// ponytail: index state and two buttons, no slide transition — the design specifies none, and the
// About carousel's mask machine exists because that one moves photo and text on different timings.
// The card also sizes to its own slide, so slides of different lengths will change its height; give
// it a min-height once the real three are in and the tallest is known.

// 0 0 8px + 1px 8px 8px, both rgba(21,20,20,0.65) — Figma's own two-layer drop shadow
const CARD_SHADOW = '0 0 8px 0 rgba(21,20,20,0.65), 1px 8px 8px 0 rgba(21,20,20,0.65)'

function Arrow({
  label,
  onClick,
  back = false,
  className = '',
}: {
  label: string
  onClick: () => void
  back?: boolean
  className?: string
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      // the phone frame has no arrows — the strip is swiped instead
      className={`hidden shrink-0 transition-opacity hover:opacity-70 md:block ${className}`}
    >
      <img
        src="/arrow_pixel.svg"
        alt=""
        aria-hidden
        className={`h-[28px] w-[32px] ${back ? 'rotate-180' : ''}`}
      />
    </button>
  )
}

export function Channels({ content }: { content: ChannelsContent }) {
  const [index, setIndex] = useState(0)
  const count = content.slides.length
  const step = (by: number) => setIndex((i) => (i + by + count) % count)

  return (
    <section
      aria-label={content.label}
      aria-roledescription="carousel"
      // Figma frame: p 112, blocks 48 apart. Mobile (2807:10160): px 16 / py 48, blocks 40 apart,
      // and it closes the section above on a keyline.
      className="w-full border-t border-[#544D49] bg-[#292624] px-4 py-12 md:p-28"
    >
      <div className="mx-auto flex w-full max-w-[1216px] flex-col items-center gap-10 md:gap-12">
        <div className="flex w-full flex-col items-center gap-6 text-center md:gap-8">
          <BracketLabel className="mx-auto w-52 text-[#FF6D6A] md:w-[360px]">
            {content.label}
          </BracketLabel>
          {/* 876px is Figma's own width, and it is what puts the break after "actually" */}
          <h2 className="max-w-[876px] font-display text-[40px] font-normal leading-[1.1] tracking-[-1px] text-[#FFFCF9] md:text-[64px]">
            {content.heading}
          </h2>
        </div>

        <div className="flex w-full items-center justify-center gap-8">
          <Arrow back label="Previous channel" onClick={() => step(-1)} />

          {/* The strip. -mx-4 cancels the section's gutters so the neighbours can show past them,
              px-4 puts them back inside, and each card is a viewport wide between them. At md+ it
              stops scrolling and only the active card is left in flow, back to one card and two
              arrows. The scrollbar is hidden: this is a swipe surface, not a pane. */}
          <div className="-mx-4 flex flex-1 snap-x snap-mandatory gap-2 overflow-x-auto px-4 [scrollbar-width:none] md:mx-0 md:snap-none md:overflow-visible md:px-0 [&::-webkit-scrollbar]:hidden">
            {content.slides.map((slide, i) => (
              <article
                key={slide.title}
                // px 16 / py 40 on the phone, 40 20 on desktop
                className={`flex w-[calc(100vw-2rem)] shrink-0 snap-center flex-col items-center gap-10 border border-[#3C3734] bg-[rgba(21,20,20,0.32)] px-4 py-10 md:w-auto md:flex-1 md:flex-row md:justify-center md:gap-20 md:px-10 md:py-16 ${
                  i === index ? '' : 'md:hidden'
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
                      <p className="shrink-0 font-sans text-[32px] leading-[1.25] tracking-[-0.5px] text-[#FCF7F3]">
                        {stat.value}
                      </p>
                      {/* Figma sets this nowrap at exactly the panel's inner width. Left to wrap
                          instead: one fallback-font glyph wider and nowrap would overflow the
                          card. */}
                      <p className="font-display text-xs font-normal leading-[1.25] tracking-[0.25px] text-[#D1C1B7] md:text-sm">
                        {stat.label}
                      </p>
                    </div>
                  ))}

                  <p className="w-full border-t border-[#3C3734] pt-4 font-display text-xs font-normal leading-[1.25] tracking-[0.25px] text-[#9F9188] md:text-center">
                    {slide.quote}
                  </p>
                </div>
              </article>
            ))}
          </div>

          <Arrow label="Next channel" onClick={() => step(1)} />
        </div>
      </div>
    </section>
  )
}
