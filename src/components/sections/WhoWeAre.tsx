import { MediaImage } from '@/components/Media/Image'
import { ArrowCircleButton } from '@/components/ui/ArrowCircleButton'
import { BracketLabel } from '@/components/ui/BracketLabel'
import { Button } from '@/components/ui/Button'
import { CountUp } from '@/components/ui/CountUp'
import { InView } from '@/components/ui/InView'
import type { WhoWeAreContent } from '@/lib/types'

// "Who we are" — same cream ground and centred copy stack as the hero, so the type styles are
// reused verbatim rather than re-specified.
// Bracket always animates (via <InView>, once, on scroll-in). Dev panel can fade the rest up.

export default function WhoWeAre({ content }: { content: WhoWeAreContent }) {
  const { label, heading, description, cards } = content

  return (
    <section aria-label="Who we are" className="w-full bg-[#fcf7f3] py-16 md:py-24 3xl:py-32">
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
        <p className="section-text-reveal mx-auto mt-6 max-w-[760px] font-sans text-base font-normal leading-[1.25] text-[#4A4A4A] md:text-xl 3xl:max-w-[900px] 3xl:text-2xl">
          {description}
        </p>

        <div className="section-media-reveal mt-10 flex flex-col gap-8 md:mt-12 3xl:mt-16">
          {cards.map((card) => (
            <article
              key={card.title}
              // Mobile: single column, stacked (title+arrow, image, body, stat). Desktop: image fills
              // the left column across all three rows; title/body/stat stack in the right column with
              // the body row growing so the stat pins to the bottom.
              className="relative grid grid-cols-1 gap-6 overflow-hidden border px-3 py-6 text-left md:grid-cols-2 md:grid-rows-[auto_1fr_auto] md:p-6 3xl:gap-x-10 3xl:p-8"
              style={{ color: card.fg, backgroundColor: card.bg, borderColor: card.border }}
            >
              {/* title row — arrow button only shows on mobile (EXPLORE takes over on desktop) */}
              <div className="flex items-center justify-between gap-4 md:col-start-2 md:row-start-1">
                {/* heading/h1/m — Neue Haas 450 / 48px / 110% */}
                <h3 className="font-display text-[32px] font-normal leading-[1.1] tracking-tight md:text-5xl 3xl:text-6xl">
                  {card.title}
                </h3>
                {/* on mobile the arrow's stretched ::before makes the whole card clickable */}
                <ArrowCircleButton
                  href={card.link.href}
                  label={card.link.label}
                  className="md:hidden before:absolute before:inset-0 before:content-['']"
                />
              </div>

              {/* campaign image — landscape crop on mobile, fills the column height on desktop */}
              <div className="aspect-[16/10] overflow-hidden md:col-start-1 md:row-start-1 md:row-span-3 md:aspect-auto md:h-full">
                {card.video ? (
                  // muted+playsInline so mobile autoplays inline; the still doubles as the poster
                  <video
                    src={card.video}
                    poster={card.image.url}
                    autoPlay
                    loop
                    muted
                    playsInline
                    preload="metadata"
                    aria-label={card.image.alt}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <MediaImage
                    media={card.image}
                    sizes="(max-width: 768px) 100vw, (min-width: 1920px) 580px, 40vw"
                    className="h-full w-full object-cover"
                  />
                )}
              </div>

              {/* body-2/xl — New Spirit 400 / 24px / 125% */}
              <p
                className="font-sans text-lg font-normal leading-[1.25] md:col-start-2 md:row-start-2 md:text-2xl 3xl:text-[28px]"
                style={{ color: card.muted }}
              >
                {card.body}
              </p>

              {/* stat row — stacked (value over label) on mobile, EXPLORE pill added on desktop */}
              <div className="flex items-end justify-between md:col-start-2 md:row-start-3 md:self-end">
                <p className="flex flex-col items-start gap-1 md:flex-row md:items-center md:gap-1.5">
                  {/* % same as heading */}
                  <CountUp
                    value={card.stat.value}
                    className="font-fira text-3xl font-normal leading-none md:text-4xl 3xl:text-5xl"
                    style={{ color: card.fg }}
                  />
                  {/* body-2/xs — New Spirit 400 / 14px / 125% */}
                  <span
                    className="font-sans text-sm leading-[1.4] whitespace-normal md:whitespace-pre-line 3xl:text-base"
                    style={{ color: card.muted }}
                  >
                    {card.stat.label}
                  </span>
                </p>
                <span className="hidden md:block">
                  <Button
                    variant="outline"
                    href={card.link.href}
                    scrambleColor={card.fg}
                    className="hover:bg-black/5"
                  >
                    {card.link.label}
                  </Button>
                </span>
              </div>
            </article>
          ))}
        </div>
      </InView>
    </section>
  )
}
