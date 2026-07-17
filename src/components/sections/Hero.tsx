import { ImageMarquee } from '@/components/ImageMarquee'
import { Button } from '@/components/ui/Button'
import { LineReveal } from '@/components/ui/LineReveal'
import { TextReveal } from '@/components/ui/TextReveal'
import { ENTRY_BASE } from '@/lib/motion'
import type { HeroContent } from '@/lib/types'

// Home hero — first section. Cream full-viewport. The whole stack (copy + strip) is centered in the
// viewport below the navbar: min-h screen + flex column + justify-center, pt-19 reserves the navbar
// (which is absolute, so it has no flow height) and keeps the centering optical. min-h, not h, so
// short viewports scroll instead of clipping.
// Heading = Figma display/l: Neue Haas (font-display) 500 / 72px / 100% leading / center / #262626.
// Desc = Figma body-2/xxl: New Spirit (font-sans) 400 / 28px / 125% leading / center / #4A4A4A.
// Entry: everything is pure CSS (fires at first paint) so the whole cascade shares ONE clock and
// stays aligned — no hydration offset. Offsets are relative to ENTRY_BASE (motion.ts), which is when
// the preloader curtain starts lifting; without it the copy would animate hidden behind the curtain.
// Timings stay code-side constants, not content — editors set copy, not stagger.
export default function Hero({ content }: { content: HeroContent }) {
  const { heading, description, button, slides } = content

  return (
    <section
      aria-label="Home"
      className="flex min-h-[100dvh] w-full flex-col justify-center bg-[#fffcf9] pt-19"
    >
      <div className="mx-auto max-w-[1056px] px-5 text-center 3xl:max-w-[1200px]">
        {/* mobile: same 2 lines, they just wrap to 4 rows (masks are per-word, so wrapping is fine) */}
        <TextReveal
          as="h1"
          text={heading}
          delay={ENTRY_BASE}
          stagger={0.05} /* per-char ripple — hero only; below the fold the line rises solid */
          lineDelay={0.2}
          className="font-display text-[40px] font-medium leading-none tracking-tight text-[#262626] md:text-7xl 3xl:text-8xl"
        />
        <LineReveal
          text={description}
          delay={ENTRY_BASE + 0.4} /* accumulates after the heading's 2 lines (0, 0.2) */
          stagger={0.03} /* per word -> 16 words land across 0.4..0.85, flowing down the wrap */
          className="mx-auto mt-6 max-w-[616px] font-sans text-lg font-normal leading-[1.25] text-[#4A4A4A] md:text-[28px] 3xl:max-w-[800px] 3xl:text-[30px]"
        />
        {/* button fades up last — pure CSS (fade-up), same paint clock as the rest. after desc's
            last word (0.85) + a beat */}
        <div
          className="fade-up mt-10 flex justify-center md:mt-6"
          style={{ animationDelay: `${ENTRY_BASE + 0.9}s` }}
        >
          <Button variant="primary" href={button.href}>
            {button.label}
          </Button>
        </div>
      </div>

      {/* full-bleed image strip below the button; already scrolling, slides fade in staggered */}
      <div className="mt-24 w-full">
        <ImageMarquee slides={slides} />
      </div>
    </section>
  )
}
