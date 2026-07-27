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
    <section
      aria-label="About us"
      // Figma desktop: 112 top+bottom, 160 sides, ground #FFFCF9
      className="w-full bg-[#fffcf9] py-16 md:py-28"
    >
      {/* desktop is three blocks 32 apart: caption / heading+desc / carousel. No max-width —
          padding is the only rule. */}
      <InView className="flex flex-col px-5 text-center md:gap-8 md:px-40">
        <BracketLabel className="mb-5 w-44 text-[#867A72] md:mb-0 md:w-80">
          {label}
        </BracketLabel>

        <div>
        <h2 className="section-text-reveal font-display text-[40px] font-normal leading-none tracking-tight text-[#262626] md:text-6xl xl:text-7xl">
          {heading.split('\n').map((line) => (
            <span key={line} className="block">
              {line}
            </span>
          ))}
        </h2>
        {/* 16px here, 24px in the other sections — designer's call, not a system value */}
        {/* body-2/l — New Spirit 400 / 20 / 125% / letter-spacing l / #4A4A4A, centred */}
        <p className="section-text-reveal mx-auto mt-4 max-w-[620px] font-sans text-xl md:text-2xl xl:text-[28px] font-normal leading-[1.25] tracking-[-0.01em] text-[#4A4A4A] 3xl:max-w-[720px]">
          {description}
        </p>
        </div>

        <TeamCarousel members={members} story={story} />
      </InView>
    </section>
  )
}
