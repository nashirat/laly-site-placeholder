import { BracketLabel } from '@/components/ui/BracketLabel'
import { InView } from '@/components/ui/InView'
import { LineReveal } from '@/components/ui/LineReveal'
import { TextReveal } from '@/components/ui/TextReveal'
import { SECTION_DELAY, SECTION_STEP } from '@/lib/motion'
import type { AboutContent } from '@/lib/types'

// "About us" — cream ground, same copy stack and SECTION_DELAY cascade as the other sections. The
// desc sits tight under the heading here (Figma has them nearly touching), unlike WhoWeAre/Strategy.
export default function About({ content }: { content: AboutContent }) {
  const { label, heading, description } = content

  return (
    <section aria-label="About us" className="w-full bg-[#fffcf9] py-16 md:py-24 3xl:py-32">
      <InView className="mx-auto max-w-[1056px] px-5 text-center 3xl:max-w-[1200px]">
        <BracketLabel className="mb-5 w-44 text-[#867A72] md:mb-6 md:w-56 3xl:mb-8 3xl:w-64">
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
          className="mx-auto mt-3 max-w-[620px] font-sans text-base font-normal leading-[1.25] text-[#262626] md:text-xl 3xl:max-w-[720px] 3xl:text-2xl"
        />

        {/* ponytail: placeholder — becomes the team carousel (member photo, name, role, prev/next
            arrows, dark footer bar with the Our Story button). Here to prove the cascade only. */}
        <div
          className="fade-up mt-8 h-[420px] bg-[#F0EEEC] md:mt-10 md:h-[660px] 3xl:mt-12 3xl:h-[780px]"
          style={{ animationDelay: `${SECTION_DELAY.cards}s` }}
        />
      </InView>
    </section>
  )
}
