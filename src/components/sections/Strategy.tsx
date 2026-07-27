import { ArrowCircleButton } from '@/components/ui/ArrowCircleButton'
import { BracketLabel } from '@/components/ui/BracketLabel'
import { InView } from '@/components/ui/InView'
import type { StrategyContent } from '@/lib/types'

// "Strategy" — the dark counterpart to WhoWeAre. Same copy stack; only the ground and the card grid
// differ (3 across instead of 2 stacked).
export default function Strategy({ content }: { content: StrategyContent }) {
  const { label, heading, description, cards } = content

  return (
    <section aria-label="Strategy" className="w-full bg-[#292624] py-16 md:py-24 3xl:py-32">
      <InView className="mx-auto max-w-[1360px] px-5 text-center 3xl:max-w-[1560px]">
        <BracketLabel className="mb-5 w-44 text-[#ff6d6a] md:mb-6 md:w-80 3xl:mb-8">
          {label}
        </BracketLabel>
        <h2 className="section-text-reveal font-display text-[40px] font-normal leading-none tracking-tight text-[#fffcf9] md:text-6xl 3xl:text-7xl">
          {heading.split('\n').map((line) => (
            <span key={line} className="block">
              {line}
            </span>
          ))}
        </h2>
        <p className="section-text-reveal mx-auto mt-6 max-w-[460px] font-sans text-xl font-normal leading-[1.25] text-[#B5ADA7] 3xl:max-w-[560px] 3xl:text-2xl">
          {description}
        </p>

        {/* Rows are declared on the track parent and picked up by each card via subgrid, so title /
            badges / hook / body line up across all three cards no matter how the copy wraps. The
            last row is 1fr and the body sits at its end — the Figma "space-between" without letting
            each card resolve its own spacing. */}
        <div className="mt-10 grid gap-6 md:mt-14 md:grid-cols-3 md:grid-rows-[auto_auto_auto_1fr] md:gap-y-4 3xl:mt-20 3xl:gap-x-8 3xl:gap-y-5">
          {cards.map((card, i) => (
            // reveal is per-card, not per-grid, so they can stagger left→right. The inline
            // animation-delay longhand beats the stylesheet's `animation` shorthand (inline wins).
            <article
              key={card.title}
              // min-w-0 defeats the grid item's `min-width: auto`, so the nowrap badges stop
              // widening the track and scroll inside the card instead.
              className="section-media-reveal relative flex min-w-0 flex-col gap-4 bg-[#151414]/32 px-4 py-6 text-left 3xl:px-6 3xl:py-8 md:row-span-4 md:grid md:min-h-[400px] md:grid-rows-subgrid md:gap-y-4 3xl:gap-y-5 3xl:min-h-[460px]"
              style={{ animationDelay: `${0.2 + i * 0.2}s` }}
            >
              {/* heading/h2/l — Neue Haas 450 / 44px / 110%.
                  Mobile puts the arrow up here beside the title; desktop keeps it beside the hook
                  below. Two instances, one hidden per breakpoint — cheaper than reflowing the
                  subgrid, and only the visible one contributes its stretched ::before hit area. */}
              <div className="flex items-start justify-between gap-4">
                <h3
                  className="font-display text-[32px] font-normal leading-[1.1] tracking-tight md:text-[44px] 3xl:text-[52px]"
                  style={{ color: card.fg }}
                >
                  {/* designer's call: the subject always lands on line 2 — authored break, not wrap */}
                  {card.title.split('\n').map((line) => (
                    <span key={line} className="block">
                      {line}
                    </span>
                  ))}
                </h3>
                <ArrowCircleButton
                  href={card.link.href}
                  label={card.link.label}
                  className="md:hidden cursor-pointer text-[#FCF7F3] hover:bg-white/10 [&_img]:invert before:absolute before:inset-0 before:content-['']"
                />
              </div>

              {/* capability pills — star tinted per badge, so the accent trio comes from data */}
              {/* md+: one row, never two — a wrapped badge would grow the shared subgrid row and
                  shove every card's hook line down. Mobile has no subgrid, so it just wraps. */}
              <ul className="mt-2 flex flex-wrap gap-2 md:flex-nowrap">
                {card.badges.map((badge) => (
                  <li
                    key={badge.label}
                    className="flex h-[23px] shrink-0 items-center gap-1 whitespace-nowrap rounded-full bg-[#2D2A28] px-2 font-sans text-[13px] leading-none text-[#FCF7F3] shadow-[0_1px_2px_rgba(16,24,40,0.08)] md:px-2.5 md:text-sm 3xl:h-[27px] 3xl:px-3 3xl:text-base"
                  >
                    {/* star.svg as a mask so one asset serves all three tints */}
                    <span
                      aria-hidden
                      className="h-[10px] w-[9px] shrink-0"
                      style={{
                        backgroundColor: badge.color,
                        maskImage: 'url(/star.svg)',
                        maskSize: 'contain',
                        maskRepeat: 'no-repeat',
                        maskPosition: 'center',
                        WebkitMaskImage: 'url(/star.svg)',
                        WebkitMaskSize: 'contain',
                        WebkitMaskRepeat: 'no-repeat',
                        WebkitMaskPosition: 'center',
                      }}
                    />
                    {badge.label}
                  </li>
                ))}
              </ul>

              {/* body-2/xl — New Spirit 400 / 24px / 125% */}
              <div className="mt-4 mb-4 flex items-start justify-between gap-4">
                <p className="font-sans text-lg font-normal leading-[1.25] text-[#FCF7F3] md:text-xl 3xl:text-2xl">
                  {card.hook}
                </p>
                {/* png arrow is dark ink — inverted here for the dark ground. Its stretched ::before
                    makes the whole card the hit area (only link in the card, so nothing to nest). */}
                <ArrowCircleButton
                  href={card.link.href}
                  label={card.link.label}
                  size={40}
                  /* max-md:hidden, not `hidden md:inline-flex` — the component's own base
                     `inline-flex` outranks a bare `hidden`; only a variant beats it */
                  className="max-md:hidden cursor-pointer text-[#FCF7F3] hover:bg-white/10 [&_img]:invert before:absolute before:inset-0 before:content-['']"
                />
              </div>

              {/* body/s — Neue Haas 450 / 16px / 125% */}
              <p className="font-display text-sm font-normal leading-[1.25] text-[#D1C1B7] md:self-end md:text-base 3xl:text-lg">
                {card.body}
              </p>
            </article>
          ))}
        </div>
      </InView>
    </section>
  )
}
