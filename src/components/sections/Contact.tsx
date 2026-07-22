import { Icon } from '@/components/Icon'
import { BracketLabel } from '@/components/ui/BracketLabel'
import { Button } from '@/components/ui/Button'
import { InView } from '@/components/ui/InView'
import { Typewriter } from '@/components/ui/Typewriter'
import type { ContactContent } from '@/lib/types'

// "Contact" — brand-pink closing section. Oversized display heading with the team photo tucked
// behind its right edge.
//
// Bracket always animates like every other section. Dev panel can fade heading/photo/CTAs up.
export default function Contact({ content }: { content: ContactContent }) {
  const { label, heading, buttons, socials } = content

  return (
    <section
      aria-label="Contact"
      className="w-full overflow-hidden bg-[#ff6d6a] py-16 md:py-24 3xl:py-32"
    >
      {/* flex column + `order` so ONE photo node serves both layouts: on mobile it flows between the
          CTAs and the socials (order-1), at md+ it leaves the flow entirely and hangs off the
          container's right edge, overlapping the heading. */}
      <InView className="relative mx-auto flex max-w-[1056px] flex-col px-5 text-center 3xl:max-w-[1200px]">
        <BracketLabel className="mb-8 w-44 text-[#262626] md:mb-10 md:w-56 3xl:w-64">
          {label}
        </BracketLabel>

        {/* display-2: Neue Haas 65 Medium (w500), 200px / 90% / -6px tracking, uppercase, #151414.
            -6px at 200px == -0.03em, so the tracking scales with every step of the size ladder.
            Size steps down by container width — 200px only fits once the frame is at Figma's 1120.
            Mobile runs big enough to wrap to three lines (GROW / WITH / US.) like the design. */}
        <Typewriter
          text={heading}
          className="section-media-reveal relative z-10 font-display text-[72px] font-medium uppercase leading-[0.9] tracking-[-0.03em] text-[#151414] md:text-[140px] xl:text-[188px] 3xl:text-[200px]"
        />

        {/* ponytail: placeholder — becomes the team photo (tilted, overlapping the heading at md+).
            md top offset clears the bracket label, which is now a flex sibling rather than above. */}
        <div className="section-media-reveal order-1 z-0 mt-8 aspect-[3/2] w-full bg-[#EFEDEA] md:rotate-2 md:absolute md:right-0 md:top-12 md:order-none md:mt-0 md:aspect-auto md:h-[330px] md:w-[280px] 3xl:top-14 3xl:h-[400px] 3xl:w-[340px]" />

        <div className="section-media-reveal mt-10 flex justify-center gap-3 md:mt-12 3xl:mt-14 3xl:gap-4">
          {/* no scramble — these are the page's closing CTAs; the decrypt reads as noise on the
              action you actually want clicked */}
          <Button variant="solid" scramble={false} href={buttons[0].href}>
            {buttons[0].label}
          </Button>
          <Button variant="outline" scramble={false} href={buttons[1].href}>
            {buttons[1].label}
          </Button>
        </div>

        {/* socials — icons are 32x32 as drawn; last in both layouts (order-2 keeps them under the
            photo on mobile, where the photo is order-1) */}
        <div className="section-media-reveal order-2 mt-10 flex items-center justify-center gap-4 3xl:mt-12">
          {socials.map((s) => (
            <a
              key={s.platform}
              href={s.href ?? '#'}
              aria-label={s.platform}
              target="_blank"
              rel="noreferrer"
              className="transition-opacity hover:opacity-70"
            >
              <Icon name={s.platform} className="h-8 w-8" />
            </a>
          ))}
        </div>
      </InView>
    </section>
  )
}
