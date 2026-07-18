import { BracketLabel } from '@/components/ui/BracketLabel'
import { Button } from '@/components/ui/Button'
import { InView } from '@/components/ui/InView'
import type { ContactContent } from '@/lib/types'

// "Contact" — brand-pink closing section. Oversized display heading with the team photo tucked
// behind its right edge.
//
// Only the bracket animates (like every other section); heading/photo/CTAs render static. The
// heading gets its own bespoke animation later — until then it just sits, no placeholder motion.
export default function Contact({ content }: { content: ContactContent }) {
  const { label, heading, buttons } = content

  return (
    <section
      aria-label="Contact"
      className="w-full overflow-hidden bg-[#ff6d6a] py-16 md:py-24 3xl:py-32"
    >
      <InView className="mx-auto max-w-[1056px] px-5 text-center 3xl:max-w-[1200px]">
        <BracketLabel className="mb-8 w-44 text-[#262626] md:mb-10 md:w-56 3xl:w-64">
          {label}
        </BracketLabel>

        {/* the photo overlaps the heading's right edge, so they share a stacking context */}
        <div className="relative">
          <h2 className="relative z-10 font-display text-[64px] font-bold leading-[0.95] tracking-tight text-[#161616] md:text-[140px] 3xl:text-[180px]">
            {heading.split('\n').map((line) => (
              <span key={line} className="block">
                {line}
              </span>
            ))}
          </h2>

          {/* ponytail: placeholder — becomes the team photo (tilted, overlapping the heading). */}
          <div className="relative z-0 mx-auto mt-6 h-[220px] w-[200px] rotate-2 bg-[#EFEDEA] md:absolute md:-top-4 md:right-0 md:mt-0 md:h-[330px] md:w-[280px] 3xl:h-[400px] 3xl:w-[340px]" />
        </div>

        <div className="mt-10 flex justify-center gap-3 md:mt-12">
          {/* no scramble — these are the page's closing CTAs; the decrypt reads as noise on the
              action you actually want clicked */}
          <Button variant="solid" scramble={false} href={buttons[0].href}>
            {buttons[0].label}
          </Button>
          <Button variant="outline" scramble={false} href={buttons[1].href}>
            {buttons[1].label}
          </Button>
        </div>
      </InView>
    </section>
  )
}
