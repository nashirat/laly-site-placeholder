import { GridBackdrop } from '@/components/ui/GridBackdrop'
import { BracketLabel } from '@/components/ui/BracketLabel'
import { SystemDeck } from '@/components/sections/SystemDeck'
import type { SystemContent } from '@/lib/types'

// Figma 2767:9520 (desktop) / 2739:8892 (mobile) — "The System" on /branding. Cream ground under a
// faint grid, the argument on the left, and the three-card deck on the right. Mobile stacks the two
// and centres everything. The deck itself — its geometry, palette and 3s cycle — lives in
// SystemDeck; everything here is the frame around it.

export function BrandSystem({ content }: { content: SystemContent }) {
  return (
    <section
      aria-label={content.label}
      // Figma frame: px 112, pt 112, pb 144, blocks 96 apart. Mobile (2739:8892): px 24, pt 48,
      // pb 64, and the blocks 24 apart.
      className="relative w-full overflow-hidden bg-[#FCF7F3] px-6 pt-12 pb-16 md:px-28 md:pt-28 md:pb-36"
    >
      <GridBackdrop />

      {/* Two doodles the designer drops in the margins, at each frame's own offsets — the phone puts
          the large one half off the right edge beside the stack and the small one at the bottom
          left, and both are two thirds the size they are on desktop. Decorative. Plain <img>: they
          are static shapes in /public, and the small one carries an SVG noise filter that
          next/image would have nothing to do with. */}
      <img
        src="/branding/blob-large.svg"
        alt=""
        aria-hidden
        className="pointer-events-none absolute bottom-[256px] right-[-16px] h-[126.397px] w-[68.542px] rotate-[148.51deg] md:bottom-auto md:top-[251px] md:right-[84px] md:h-[189.261px] md:w-[102.631px]"
      />
      <img
        src="/branding/blob-small.svg"
        alt=""
        aria-hidden
        className="pointer-events-none absolute bottom-[33px] left-5 h-[41.301px] w-[15.88px] rotate-[-36.07deg] md:bottom-[102px] md:left-[55.9%] md:h-[51.075px] md:w-[19.638px]"
      />

      <div className="relative mx-auto flex w-full max-w-[1216px] flex-col gap-6 md:gap-24">
        <div className="flex flex-col gap-6 text-center md:gap-8">
          <BracketLabel className="mx-auto w-44 text-[#867A72] md:w-80">
            {content.label}
          </BracketLabel>
          {/* heading/h1/xl: Neue Haas 450 (→400) / 64 / 110% / -1px, 40 on the phone. Per-line
              spans, same as Strategy — the \n is a break the designer set, not a wrap. */}
          <h2 className="font-display text-[40px] font-normal leading-[1.1] tracking-[-1px] text-[#292624] md:text-[64px]">
            {content.heading.split('\n').map((line) => (
              <span key={line} className="block">
                {line}
              </span>
            ))}
          </h2>
        </div>

        <div className="flex flex-col items-center gap-8 md:flex-row md:justify-center md:gap-20">
          {/* 600px is Figma's own column. Centred under the heading on a phone, left-aligned against
              it once the stack moves alongside. */}
          <p className="w-full max-w-[600px] whitespace-pre-line text-center font-sans text-xl leading-[1.25] text-[#4A4A4A] md:text-left md:text-[28px]">
            {content.body.before}
            {/* New Spirit Bold Condensed — the thesis, set apart from the copy either side of it */}
            <strong className="font-bold">{content.body.emphasis}</strong>
            {content.body.after}
          </p>

          {/* The deck: three interchangeable cards, one at the front at a time, cycling every 3s.
              It owns its own scroll gate and timer, so this stays a server component. */}
          <SystemDeck chain={content.chain} />
        </div>
      </div>
    </section>
  )
}
