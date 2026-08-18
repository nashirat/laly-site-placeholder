'use client'

import { useState } from 'react'
import { EMBER_WASH } from '@/lib/palettes'
import { BracketLabel } from '@/components/ui/BracketLabel'
import type { ChannelsContent } from '@/lib/types'

// Figma 2796:9847 — "The Channels" on /branding. Dark ground, label/heading, then one card at a time
// with a pixel arrow either side. Same arrow asset the About carousel uses (/arrow_pixel.svg is
// byte-for-byte the Figma export), left one just rotated.
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
      className={`shrink-0 transition-opacity hover:opacity-70 ${className}`}
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
  const slide = content.slides[index]
  const step = (by: number) => setIndex((i) => (i + by + count) % count)

  return (
    <section
      aria-label={content.label}
      aria-roledescription="carousel"
      // Figma frame: p 112, blocks 48 apart. Mobile has no frame yet — px 16 / py 48 like the rest.
      className="w-full bg-[#292624] px-4 py-12 md:p-28"
    >
      <div className="mx-auto flex w-full max-w-[1216px] flex-col items-center gap-8 md:gap-12">
        <div className="flex w-full flex-col items-center gap-6 text-center md:gap-8">
          <BracketLabel className="mx-auto w-52 text-[#FF6D6A] md:w-[360px]">
            {content.label}
          </BracketLabel>
          {/* 876px is Figma's own width, and it is what puts the break after "actually" */}
          <h2 className="max-w-[876px] font-display text-[40px] font-normal leading-[1.1] tracking-[-1px] text-[#FFFCF9] md:text-[64px]">
            {content.heading}
          </h2>
        </div>

        {/* Arrows flank the card at md+ and pair up under it below, where there is no room beside
            it. md:contents dissolves their mobile row so the outer flex lays all three out itself,
            and the order classes put the card back between them. */}
        <div className="flex w-full flex-col items-center gap-6 md:flex-row md:justify-center md:gap-8">
          <div className="order-2 flex items-center gap-10 md:contents">
            <Arrow back label="Previous channel" onClick={() => step(-1)} className="md:order-1" />
            <Arrow label="Next channel" onClick={() => step(1)} className="md:order-3" />
          </div>

          <div
            className="order-1 flex w-full flex-1 flex-col items-center gap-10 border border-[#3C3734] bg-[rgba(21,20,20,0.32)] px-5 py-10 md:order-2 md:flex-row md:justify-center md:gap-20 md:px-10 md:py-16"
            style={{ boxShadow: CARD_SHADOW }}
          >
            <div className="flex w-full flex-1 flex-col items-start gap-5">
              {/* Figma draws an arrow-up-right button beside the title at opacity 0 — a link that
                  does not exist yet, so it is not rendered. Same call as the paid-advertising
                  panels. */}
              <p className="w-full font-sans text-[32px] leading-[1.25] tracking-[-0.5px] text-[#FCF7F3] md:text-[40px]">
                {slide.title}
              </p>
              {/* New Spirit Medium Condensed — heavier than the paragraph under it, not bold */}
              <p className="w-full font-sans text-xl font-medium leading-[1.4] tracking-[-0.5px] text-[#FCF7F3] md:text-2xl">
                {slide.lede}
              </p>
              <p className="w-full font-display text-lg font-normal leading-[1.25] tracking-[0.25px] text-[#E7DCD4] md:text-xl">
                {slide.body}
              </p>
            </div>

            {/* 400px fixed at md+, full width below. The rule between the stats and the quote is a
                border, not the 1px svg Figma exports for it. */}
            <div
              className="flex w-full shrink-0 flex-col gap-4 border border-[#292624] p-6 md:w-[400px]"
              style={{ backgroundImage: EMBER_WASH }}
            >
              {slide.stats.map((stat) => (
                <div key={stat.label} className="flex w-full flex-col items-center gap-2 text-center">
                  <p className="font-sans text-[28px] leading-[1.25] tracking-[-0.5px] text-[#FCF7F3] md:text-[32px]">
                    {stat.value}
                  </p>
                  {/* Figma sets this nowrap at exactly the panel's inner width. Left to wrap
                      instead: one fallback-font glyph wider and nowrap would overflow the card. */}
                  <p className="font-display text-sm font-normal leading-[1.25] tracking-[0.25px] text-[#D1C1B7]">
                    {stat.label}
                  </p>
                </div>
              ))}

              <p className="w-full border-t border-[#3C3734] pt-4 text-center font-display text-xs font-normal leading-[1.25] tracking-[0.25px] text-[#9F9188]">
                {slide.quote}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
