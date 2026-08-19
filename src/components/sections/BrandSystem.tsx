import { GridBackdrop } from '@/components/ui/GridBackdrop'
import { BracketLabel } from '@/components/ui/BracketLabel'
import type { SystemContent } from '@/lib/types'

// Figma 2767:9520 (desktop) / 2739:8892 (mobile) — "The System" on /branding. Cream ground under a
// faint grid, the argument on the left, and three overlapping cards on the right. Mobile stacks the
// two and centres everything.
//
// The stack is the point: the two upper cards are drawn in a tint of their own ground, so they read
// as background layers the front card is sitting on. They are real text, not decoration, so they
// stay in the accessibility tree at the contrast the design gives them.

// Figma builds the two ghost cards as scaled instances of the front one — 380/400 against a 418px
// card, and every inner number lands on the same two ratios (padding 21.818/22.967 of 24, gap
// 7.273/7.656 of 8, blurb 25.455/26.794 of 28, tracking 0.909/0.957 of 1).
//
// The mobile frame is that same stack again at a 300px front card: 272.727 and 287.081 are 0.909
// and 0.9569 of 300, its padding is 17.225 (24 x 300/418), its overlap 51.675 (72 x 300/418). So
// rather than a second set of numbers on a breakpoint, the stack is a container and everything
// inside it is a percentage of its own width — the ratios then hold at 300, at 418, and at every
// width in between, which is where a phone in landscape actually lands.
//
// Percentages of the front card's width, from the desktop frame's pixels:
const CARD = {
  padding: 5.742, // 24
  gap: 1.914, // 8
  blurb: 6.699, // 28
  overlap: 17.225, // 72 — each card pulled up into the one below it, in DOM order, so the front
  //                       card paints last and needs no z-index
  tracking: 0.2392, // 1px
}

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
        padding: `${CARD.padding * scale}cqw`,
        gap: `${CARD.gap * scale}cqw`,
        marginBottom: `-${CARD.overlap}cqw`,
      }}
    >
      {/* the title is the one thing Figma does not scale with the card — 34 on the phone frame, 56
          on the desktop one — so it stays on the breakpoint while its tracking rides the card */}
      <p
        className="w-full font-sans text-[34px] font-medium leading-[1.1] md:text-[56px]"
        style={{ color: fg, letterSpacing: `-${CARD.tracking * scale}cqw` }}
      >
        {title}
      </p>
      <p
        className="w-full font-sans leading-[1.25] text-[#544D49]"
        style={{ fontSize: `${CARD.blurb * scale}cqw` }}
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
      // Figma frame: px 112, pt 112, pb 144, blocks 96 apart. Mobile (2739:8892): px 24, pt 48,
      // pb 64, and the blocks 24 apart.
      className="relative w-full overflow-hidden bg-[#FCF7F3] px-6 pt-12 pb-16 md:px-28 md:pt-28 md:pb-36"
    >
      <GridBackdrop />

      {/* Two doodles the designer drops in the margins, at each frame's own offsets — the phone puts
          the large one half off the right edge beside the stack and the small one at the bottom
          left, and both are two thirds the size they are on desktop. Decorative. Plain <img>: they
          are static shapes in /public, and the small one carries an SVG noise filter that
          next/image would have nothing to do with. */}
      <img
        src="/branding/blob-large.svg"
        alt=""
        aria-hidden
        className="pointer-events-none absolute bottom-[256px] right-[-16px] h-[126.397px] w-[68.542px] rotate-[148.51deg] md:bottom-auto md:top-[251px] md:right-[84px] md:h-[189.261px] md:w-[102.631px]"
      />
      <img
        src="/branding/blob-small.svg"
        alt=""
        aria-hidden
        className="pointer-events-none absolute bottom-[33px] left-5 h-[41.301px] w-[15.88px] rotate-[-36.07deg] md:bottom-[102px] md:left-[55.9%] md:h-[51.075px] md:w-[19.638px]"
      />

      <div className="relative mx-auto flex w-full max-w-[1216px] flex-col gap-6 md:gap-24">
        <div className="flex flex-col gap-6 text-center md:gap-8">
          <BracketLabel className="mx-auto w-44 text-[#867A72] md:w-80">
            {content.label}
          </BracketLabel>
          {/* heading/h1/xl: Neue Haas 450 (→400) / 64 / 110% / -1px, 40 on the phone. Per-line
              spans, same as Strategy — the \n is a break the designer set, not a wrap. */}
          <h2 className="font-display text-[40px] font-normal leading-[1.1] tracking-[-1px] text-[#292624] md:text-[64px]">
            {content.heading.split('\n').map((line) => (
              <span key={line} className="block">
                {line}
              </span>
            ))}
          </h2>
        </div>

        <div className="flex flex-col items-center gap-8 md:flex-row md:justify-center md:gap-20">
          {/* 600px is Figma's own column. Centred under the heading on a phone, left-aligned against
              it once the stack moves alongside. */}
          <p className="w-full max-w-[600px] whitespace-pre-line text-center font-sans text-xl leading-[1.25] text-[#4A4A4A] md:text-left md:text-[28px]">
            {content.body.before}
            {/* New Spirit Bold Condensed — the thesis, set apart from the copy either side of it */}
            <strong className="font-bold">{content.body.emphasis}</strong>
            {content.body.after}
          </p>

          {/* The container the ratios above are measured against: 300 wide on the phone frame, 418
              on the desktop one, and the cards inside size themselves off whichever it is. */}
          <div className="@container flex w-full max-w-[300px] flex-col items-center md:max-w-[418px]">
            <GhostCard {...physical} scale={0.909} bg="#F6EEF5" fg="#EBD6E9" />
            <GhostCard {...social} scale={0.9569} bg="#E6E6C6" fg="#CACA86" />

            {/* The only card in full colour, and the only one with a border. */}
            <div
              className="flex w-full flex-col items-center justify-center border border-[#AE8340] bg-[#F2BA63] text-center text-[#614A28]"
              style={{ padding: `${CARD.padding}cqw` }}
            >
              <div
                className="flex w-full flex-col items-center"
                style={{ gap: `${CARD.gap}cqw` }}
              >
                <p className="w-full font-sans text-[34px] font-medium leading-[1.25] tracking-[-0.5px] md:text-[56px]">
                  {search.title}
                </p>
                {/* 370 of 418 on desktop, 265.55 of 300 on the phone — the same 88.5%, and it is
                    what breaks this blurb onto two lines. Neue Haas here, not the serif the ghosts
                    use. */}
                <p className="w-full max-w-[88.5%] font-display text-[22px] leading-[1.25] md:text-[32px]">
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
