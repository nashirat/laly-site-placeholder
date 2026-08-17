import gridTexture from '../../../public/branding/grid.webp'
import { MediaImage } from '@/components/Media/Image'
import { texture } from '@/components/sections/ServiceHero'
import type { SystemContent } from '@/lib/types'

// Figma 2767:9520 — "The System" on /branding. Cream ground under a faint grid, the argument on the
// left, and three overlapping cards on the right.
//
// The stack is the point: the two upper cards are drawn in a tint of their own ground, so they read
// as background layers the front card is sitting on. They are real text, not decoration, so they
// stay in the accessibility tree at the contrast the design gives them.

// Figma builds the two ghost cards as scaled instances of the front one — 380/400 against a 418px
// card, and every inner number lands on the same two ratios (padding 21.818/22.967 of 24, gap
// 7.273/7.656 of 8, blurb 25.455/26.794 of 28, tracking 0.909/0.957 of 1). One factor per card
// reproduces all of it, and expressing the widths as percentages of the 418 lets the whole stack
// shrink on a phone without the ratios drifting.
const CARD = { width: 418, padding: 24, gap: 8, blurb: 28 }

// Each card is pulled up into the one below it by 72px, in DOM order, so the front card paints last
// and needs no z-index.
const OVERLAP = '-72px'

function GhostCard({
  title,
  blurb,
  scale,
  bg,
  fg,
}: {
  title: string
  blurb: string
  scale: number
  bg: string
  fg: string // the title, in a tint of its own card — legible, but reading as a layer behind
}) {
  return (
    <div
      className="flex flex-col items-center text-center"
      style={{
        width: `${scale * 100}%`,
        backgroundColor: bg,
        padding: CARD.padding * scale,
        gap: CARD.gap * scale,
        marginBottom: OVERLAP,
      }}
    >
      {/* 56px flat at both scales — Figma leaves the title size alone and only scales its tracking */}
      <p
        className="w-full font-sans text-[40px] font-medium leading-[1.1] md:text-[56px]"
        style={{ color: fg, letterSpacing: `${-scale}px` }}
      >
        {title}
      </p>
      <p
        className="w-full font-sans leading-[1.25] text-[#544D49]"
        style={{ fontSize: CARD.blurb * scale }}
      >
        {blurb}
      </p>
    </div>
  )
}

export function BrandSystem({ content }: { content: SystemContent }) {
  const [physical, social, search] = content.chain

  return (
    <section
      aria-label={content.label}
      // Figma frame: px 112, pt 112, pb 144, blocks 96 apart. Mobile has no frame yet — it stacks on
      // the same px 16 / py 48 the other cream sections use.
      className="relative w-full overflow-hidden bg-[#FCF7F3] px-4 py-12 md:px-28 md:pt-28 md:pb-36"
    >
      <MediaImage
        media={texture(gridTexture)}
        quality={60}
        sizes="100vw"
        className="pointer-events-none absolute inset-0 size-full object-cover opacity-15"
      />

      {/* Two doodles the designer drops in the margins, at the Figma frame's own offsets. Decorative
          and purely desktop — below md there is no margin to put them in. Plain <img>: they are
          static shapes in /public, and the small one carries an SVG noise filter that next/image
          would have nothing to do with. */}
      <img
        src="/branding/blob-large.svg"
        alt=""
        aria-hidden
        className="pointer-events-none absolute top-[251px] right-[84px] hidden h-[189.261px] w-[102.631px] rotate-[148.51deg] md:block"
      />
      <img
        src="/branding/blob-small.svg"
        alt=""
        aria-hidden
        className="pointer-events-none absolute bottom-[102px] left-[55.9%] hidden h-[51.075px] w-[19.638px] rotate-[-36.07deg] md:block"
      />

      <div className="relative mx-auto flex w-full max-w-[1216px] flex-col gap-10 md:gap-24">
        <div className="flex flex-col gap-6 text-center md:gap-8">
          <p className="font-mono text-sm font-normal uppercase leading-[1.4] tracking-[1px] text-[#867A72] md:text-2xl">
            [ {content.label} ]
          </p>
          {/* heading/h1/xl: Neue Haas 450 (→400) / 64 / 110% / -1px. Per-line spans, same as
              Strategy — the \n is a break the designer set, not a wrap. */}
          <h2 className="font-display text-[40px] font-normal leading-[1.1] tracking-[-1px] text-[#292624] md:text-[64px]">
            {content.heading.split('\n').map((line) => (
              <span key={line} className="block">
                {line}
              </span>
            ))}
          </h2>
        </div>

        <div className="flex flex-col items-center gap-10 md:flex-row md:justify-center md:gap-20">
          {/* 600px is Figma's own column. Left-aligned against the centred heading above it. */}
          <p className="w-full max-w-[600px] whitespace-pre-line font-sans text-xl leading-[1.25] text-[#4A4A4A] md:text-[28px]">
            {content.body.before}
            {/* New Spirit Bold Condensed — the thesis, set apart from the copy either side of it */}
            <strong className="font-bold">{content.body.emphasis}</strong>
            {content.body.after}
          </p>

          {/* The stack sizes off the front card, so the ghosts keep their ratios at any width. */}
          <div
            className="flex w-full flex-col items-center"
            style={{ maxWidth: CARD.width }}
          >
            <GhostCard {...physical} scale={0.909} bg="#F6EEF5" fg="#EBD6E9" />
            <GhostCard {...social} scale={0.9569} bg="#E6E6C6" fg="#CACA86" />

            {/* The only card in full colour, and the only one with a border. */}
            <div
              className="flex w-full flex-col items-center justify-center gap-4 border border-[#AE8340] bg-[#F2BA63] text-center text-[#614A28]"
              style={{ padding: CARD.padding }}
            >
              <div className="flex w-full flex-col items-center gap-2">
                <p className="w-full font-sans text-[40px] font-medium leading-[1.25] tracking-[-0.5px] md:text-[56px]">
                  {search.title}
                </p>
                {/* 370px is Figma's width, and it is what breaks this blurb onto two lines. Neue
                    Haas here, not the serif the ghosts use. */}
                <p className="w-full max-w-[370px] font-display text-2xl leading-[1.25] md:text-[32px]">
                  {search.blurb.before}
                  {/* Figma sets 56 Italic; no italic Neue Haas is self-hosted, so this is the
                      browser's synthesised oblique. Swap in a real face if it reads wrong. */}
                  <em className="italic">{search.blurb.emphasis}</em>
                  {search.blurb.after}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
