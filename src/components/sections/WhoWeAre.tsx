import { BracketLabel } from '@/components/ui/BracketLabel'
import { InView } from '@/components/ui/InView'
import type { WhoWeAreContent } from '@/lib/types'

// "Who we are" — same cream ground and centred copy stack as the hero, so the type styles are
// reused verbatim rather than re-specified.
// Only the bracket label animates (via <InView>, once, on scroll-in). The copy and cards render
// static — no per-section entry motion below the fold (team review: reads premium, skimmable).

// Each card carries its own palette — the border is tinted to the fill, not shared section-wide.
// ponytail: colors only. These are placeholders; the real case-study cards bring image/copy/stat
// and their own field shape, and this array becomes a Payload array field.
const CARDS = [
  { bg: '#C9CF88', border: '#262626' },
  { bg: '#EFDFEE', border: '#716370' },
]
export default function WhoWeAre({ content }: { content: WhoWeAreContent }) {
  const { label, heading, description } = content

  return (
    <section aria-label="Who we are" className="w-full bg-[#fcf7f3] py-16 md:py-24 3xl:py-32">
      <InView className="mx-auto max-w-[1056px] px-5 text-center 3xl:max-w-[1200px]">
        <BracketLabel className="mb-5 w-44 text-[#867A72] md:mb-6 md:w-56 3xl:mb-8 3xl:w-64">
          {label}
        </BracketLabel>
        <h2 className="font-display text-[32px] font-normal leading-none tracking-tight text-[#262626] md:text-6xl 3xl:text-7xl">
          {heading.split('\n').map((line) => (
            <span key={line} className="block">
              {line}
            </span>
          ))}
        </h2>
        <p className="mx-auto mt-6 max-w-[760px] font-sans text-base font-normal leading-[1.25] text-[#4A4A4A] md:text-xl 3xl:max-w-[900px] 3xl:text-2xl">
          {description}
        </p>

        {/* ponytail: placeholder cards — height only, no content. They exist to push the section
            down so the scroll triggers below have something to scroll past. Replaced by the real
            case-study cards (image + copy + stat + Explore), which bring their own data shape. */}
        <div className="mt-10 flex flex-col gap-8 md:mt-12 md:gap-12 3xl:mt-16 3xl:gap-16">
          {CARDS.map((card) => (
            <div
              key={card.bg}
              className="h-[420px] border md:h-[500px] 3xl:h-[600px]"
              style={{ backgroundColor: card.bg, borderColor: card.border }}
            />
          ))}
        </div>
      </InView>
    </section>
  )
}
