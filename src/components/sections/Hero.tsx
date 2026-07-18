import { ImageMarquee } from '@/components/ImageMarquee'
import { Button } from '@/components/ui/Button'
import type { HeroContent } from '@/lib/types'

// Home hero — first section. Cream full-viewport. The whole stack (copy + strip) is centered in the
// viewport below the navbar: min-h screen + flex column + justify-center, pt-19 reserves the navbar
// (which is absolute, so it has no flow height) and keeps the centering optical. min-h, not h, so
// short viewports scroll instead of clipping.
// Heading = Figma display/l: Neue Haas (font-display) 500 / 72px / 100% leading / center / #262626.
// Desc = Figma body-2/xxl: New Spirit (font-sans) 400 / 28px / 125% leading / center / #4A4A4A.
// Entry: `preloading-done` starts the curtain close and hero sequence together. Heading waits 1s,
// so it begins shortly before the 1.2s curtain close completes.
export default function Hero({ content }: { content: HeroContent }) {
  const { heading, description, button, slides } = content

  return (
    <section
      aria-label="Home"
      className="flex min-h-[100dvh] w-full flex-col justify-center bg-[#fffcf9] pt-19"
    >
      <div className="mx-auto max-w-[1056px] px-5 text-center 3xl:max-w-[1200px]">
        {/* whole heading fades up as one — no per-letter ripple (reads tacky, team review). The
            authored \n stays a hard break via block spans; on mobile each line wraps beneath it. */}
        <h1
          className="entry-copy font-display text-[40px] font-medium leading-none tracking-tight text-[#262626] md:text-7xl 3xl:text-8xl"
          style={{ animationDelay: '0.8s' }}
        >
          {heading.split('\n').map((line) => (
            <span key={line} className="block">
              {line}
            </span>
          ))}
        </h1>
        <p
          className="entry-copy mx-auto mt-6 max-w-[616px] font-sans text-lg font-normal leading-[1.25] text-[#4A4A4A] md:text-[28px] 3xl:max-w-[800px] 3xl:text-[30px]"
          style={{ animationDelay: '0.95s' }}
        >
          {description}
        </p>
        <div className="entry-copy mt-10 flex justify-center md:mt-6" style={{ animationDelay: '1.1s' }}>
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
