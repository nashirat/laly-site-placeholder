import { ImageMarquee } from '@/components/ImageMarquee'
import { Button } from '@/components/ui/Button'
import { Fragment } from 'react'
import type { CSSProperties } from 'react'
import type { HeroContent } from '@/lib/types'

// Home hero — first section. Cream full-viewport. The whole stack (copy + strip) is centered in the
// viewport below the navbar: min-h screen + flex column + justify-center, pt-19 reserves the navbar
// (which is absolute, so it has no flow height) and keeps the centering optical. min-h, not h, so
// short viewports scroll instead of clipping.
// Heading = Figma display/l: Neue Haas (font-display) 500 / 72px / 100% leading / center / #262626.
// Mobile = Figma heading/h1/s: 450 (→400, only 400/500/700 shipped) / 44px / 110% leading.
// Desc = Figma body-2/xxl: New Spirit (font-sans) 400 / 28px / 125% leading / center / #4A4A4A.
// Entry: `preloading-done` starts the curtain close and hero sequence together. Heading waits 0.8s,
// so it begins shortly before the 1.2s curtain close completes.
export default function Hero({ content }: { content: HeroContent }) {
  const { heading, description, button, slides } = content
  const rows = heading.split('\n').map((line) => line.trim()).filter(Boolean)

  return (
    <section
      aria-label="Home"
      className="flex min-h-[100dvh] w-full flex-col justify-center bg-[#fffcf9] pt-19"
    >
      {/* Figma mobile: text container hugs at 291px (≈50px each side on a 390 frame), children gap 20 */}
      <div className="mx-auto max-w-[291px] px-0 text-center md:max-w-[1056px] md:px-5 3xl:max-w-[1200px]">
        {/* whole heading fades up as one — no per-letter ripple (reads tacky, team review). The
            authored \n stays a hard break via block spans; on mobile each line wraps beneath it. */}
        <h1
          aria-label={rows.join(' ')}
          className="hero-heading entry-copy font-display text-[44px] font-normal leading-[1.1] tracking-tight text-[#262626] md:text-7xl md:font-medium md:leading-none 3xl:text-8xl"
          style={{ animationDelay: '0.8s' }}
        >
          {rows.map((line, lineIndex) => {
            let charIndex = 0

            return (
              <span key={line} aria-hidden className="block">
                {line.split(' ').map((word, wordIndex) => (
                  <Fragment key={`${line}-${wordIndex}`}>
                    {wordIndex > 0 && ' '}
                    <span className="heading-word">
                      {Array.from(word).map((char, i) => (
                        <span
                          key={`${word}-${i}`}
                          className="heading-char"
                          style={
                            {
                              '--char-delay': `${lineIndex * 0.25 + charIndex++ * 0.05}s`,
                            } as CSSProperties
                          }
                        >
                          {char}
                        </span>
                      ))}
                    </span>
                  </Fragment>
                ))}
              </span>
            )
          })}
        </h1>
        <p
          className="hero-desc entry-copy mx-auto mt-5 max-w-[616px] md:mt-6 font-sans text-lg font-normal leading-[1.25] text-[#4A4A4A] md:text-[28px] 3xl:max-w-[800px] 3xl:text-[30px]"
          style={{ animationDelay: '0.95s' }}
        >
          {description}
        </p>
        <div
          className="hero-cta entry-copy mt-5 flex justify-center md:mt-6"
          style={{ animationDelay: '1.1s' }}
        >
          <Button variant="primary" href={button.href}>
            {button.label}
          </Button>
        </div>
      </div>

      {/* full-bleed image strip below the button; already scrolling, slides fade in staggered */}
      {/* Figma mobile: hero stack gap = spacing/56 */}
      <div className="mt-14 w-full md:mt-24">
        <ImageMarquee slides={slides} />
      </div>
    </section>
  )
}
