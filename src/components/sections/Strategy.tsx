import { BracketLabel } from '@/components/ui/BracketLabel'
import { InView } from '@/components/ui/InView'
import type { StrategyContent } from '@/lib/types'

// "Strategy" — the dark counterpart to WhoWeAre. Same copy stack; only the ground and the card grid
// differ (3 across instead of 2 stacked).
export default function Strategy({ content }: { content: StrategyContent }) {
  const { label, heading, description } = content

  return (
    <section aria-label="Strategy" className="w-full bg-[#292624] py-16 md:py-24 3xl:py-32">
      <InView className="mx-auto max-w-[1360px] px-5 text-center 3xl:max-w-[1560px]">
        <BracketLabel className="mb-5 w-44 text-[#ff6d6a] md:mb-6 md:w-56 3xl:mb-8 3xl:w-64">
          {label}
        </BracketLabel>
        <h2 className="section-text-reveal font-display text-[32px] font-normal leading-none tracking-tight text-[#fffcf9] md:text-6xl 3xl:text-7xl">
          {heading.split('\n').map((line) => (
            <span key={line} className="block">
              {line}
            </span>
          ))}
        </h2>
        <p className="section-text-reveal mx-auto mt-6 max-w-[460px] font-sans text-base font-normal leading-[1.25] text-[#B5ADA7] md:text-xl 3xl:max-w-[560px] 3xl:text-2xl">
          {description}
        </p>

        {/* ponytail: placeholder cards — height only. The real ones (title, pill list, hook copy,
            arrow link, body) bring their own data shape; these just prove the cascade. */}
        <div className="section-media-reveal mt-10 grid gap-6 md:mt-14 md:grid-cols-3 3xl:mt-20 3xl:gap-8">
          {[0, 1, 2].map((i) => (
            <div key={i} className="h-[300px] bg-[#332E2B] md:h-[420px] 3xl:h-[500px]" />
          ))}
        </div>
      </InView>
    </section>
  )
}
