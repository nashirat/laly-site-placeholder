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
    <section
      aria-label="Who we are"
      // Figma desktop: 112 top+bottom, 160 sides, ground #FCF7F3
      className="w-full bg-[#fcf7f3] py-16 md:py-28"
    >
      {/* no max-width — Figma's padding is the only rule: 20 sides mobile, 160 desktop */}
      <InView className="px-5 text-center md:px-40">
        <BracketLabel className="mb-5 w-44 text-[#867A72] md:mb-8 md:w-80">
          {label}
        </BracketLabel>
        <h2 className="section-text-reveal font-display text-[40px] font-normal leading-none tracking-tight text-[#262626] md:text-6xl xl:text-7xl">
          {heading.split('\n').map((line) => (
            <span key={line} className="block">
              {line}
            </span>
          ))}
        </h2>
        {/* two paragraphs on mobile, one flowing block on desktop — the paragraphs go inline at md+
            and the second picks up a leading space from ::before, so no second copy of the text */}
        <div className="mt-6">
          {description.split('\n\n').map((para, i) => (
            <p
              key={para}
              // wider tracking pushes "That" onto line 2, matching the Figma wrap
              className={`section-text-reveal font-sans text-xl md:text-2xl xl:text-[28px] font-normal leading-[1.25] tracking-[0.02em] text-[#4A4A4A] md:inline ${
                i > 0 ? "mt-6 md:mt-0 md:before:content-['_']" : ''
              }`}
            >
              {para}
            </p>
          ))}
        </div>

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
              {/* outline, not border: the video card composites onto its own layer and paints over
                  a 1px border. outline draws above content, -offset-1 keeps it inside the box so
                  the two cards still measure identically. */}
              <div
                className="aspect-[16/10] overflow-hidden outline outline-1 -outline-offset-1 md:col-start-1 md:row-start-1 md:row-span-3 md:aspect-auto md:h-full"
                style={{ outlineColor: card.border }}
              >
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
                    /* block — a <video> is inline by default, so it leaves a baseline gap that
                       pushes it past the bottom edge of the bordered box */
                    className="block h-full w-full object-cover"
                  />
                ) : (
                  <MediaImage
                    media={card.image}
                    sizes="(max-width: 1151px) 100vw, (min-width: 1920px) 580px, 40vw"
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
