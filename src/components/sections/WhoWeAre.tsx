import { BracketLabel } from '@/components/ui/BracketLabel'
import { InView } from '@/components/ui/InView'
import { LineReveal } from '@/components/ui/LineReveal'
import { TextReveal } from '@/components/ui/TextReveal'
import { SECTION_DELAY, SECTION_STEP } from '@/lib/motion'
import type { WhoWeAreContent } from '@/lib/types'

// "Who we are" — same cream ground and centred copy stack as the hero, so the type styles are
// reused verbatim rather than re-specified.
// Scroll-triggered, not paint-clock like the hero: <InView> releases the whole cascade at once, so
// the delays are measured from the moment the section enters view (see SECTION_DELAY in motion.ts).
export default function WhoWeAre({ content }: { content: WhoWeAreContent }) {
  const { label, heading, description } = content

  return (
    <section aria-label="Who we are" className="w-full bg-[#fffcf9] py-16 md:py-24 3xl:py-32">
      <InView className="mx-auto max-w-[1056px] px-5 text-center 3xl:max-w-[1200px]">
        <BracketLabel className="mb-5 w-44 text-[#4A4A4A] md:mb-6 md:w-56 3xl:mb-8 3xl:w-64">
          {label}
        </BracketLabel>
        <TextReveal
          as="h2"
          text={heading}
          delay={SECTION_DELAY.heading}
          lineDelay={SECTION_STEP}
          className="font-display text-[32px] font-normal leading-none tracking-tight text-[#262626] md:text-6xl 3xl:text-7xl"
        />
        <LineReveal
          text={description}
          delay={SECTION_DELAY.desc}
          className="mx-auto mt-6 max-w-[760px] font-sans text-base font-normal leading-[1.25] text-[#4A4A4A] md:text-xl 3xl:max-w-[900px] 3xl:text-2xl"
        />

        {/* ponytail: placeholder cards — height only, no content. They exist to push the section
            down so the scroll triggers below have something to scroll past. Replaced by the real
            case-study cards (image + copy + stat + Explore), which bring their own data shape. */}
        <div className="mt-10 flex flex-col gap-8 md:mt-12 md:gap-12 3xl:mt-16 3xl:gap-16">
          {['#C9CF88', '#EFDFEE'].map((bg, i) => (
            <div
              key={bg}
              className="fade-up h-[420px] rounded-md md:h-[500px] 3xl:h-[600px]"
              style={{
                backgroundColor: bg,
                animationDelay: `${SECTION_DELAY.cards + i * SECTION_STEP}s`,
              }}
            />
          ))}
        </div>
      </InView>
    </section>
  )
}
