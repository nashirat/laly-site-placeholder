import { TeamCarousel } from '@/components/TeamCarousel'
import { BracketLabel } from '@/components/ui/BracketLabel'
import { InView } from '@/components/ui/InView'
import type { AboutContent } from '@/lib/types'

// "About us" — cream ground, same copy stack as the other sections. Bracket always animates; dev
// panel can fade the rest up.
// The desc sits tight under the heading here (Figma has them nearly touching), unlike WhoWeAre.
export default function About({ content }: { content: AboutContent }) {
  const { label, heading, description, members, story } = content

  return (
    <section aria-label="About us" className="w-full bg-[#fffcf9] py-16 md:py-24 3xl:py-32">
      <InView className="mx-auto max-w-[1056px] px-5 text-center 3xl:max-w-[1200px]">
        <BracketLabel className="mb-5 w-44 text-[#867A72] md:mb-6 md:w-56 3xl:mb-8 3xl:w-64">
          {label}
        </BracketLabel>
        <h2 className="section-text-reveal font-display text-[32px] font-normal leading-none tracking-tight text-[#262626] md:text-6xl 3xl:text-7xl">
          {heading.split('\n').map((line) => (
            <span key={line} className="block">
              {line}
            </span>
          ))}
        </h2>
        <p className="section-text-reveal mx-auto mt-3 max-w-[620px] font-sans text-base font-normal leading-[1.25] text-[#262626] md:text-xl 3xl:max-w-[720px] 3xl:text-2xl">
          {description}
        </p>

        <TeamCarousel members={members} story={story} />
      </InView>
    </section>
  )
}
