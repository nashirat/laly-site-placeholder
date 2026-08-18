import type { Metadata } from 'next'
import type { CSSProperties } from 'react'
import type { StaticImageData } from 'next/image'
import heroBg from '../../../../public/paid-advertising/hero.webp'
import { MediaImage } from '@/components/Media/Image'
import Contact from '@/components/sections/Contact'
import Note from '@/components/sections/Note'
import { getHome, getPaid } from '@/lib/cms'
import { PILL_COLORS } from '@/lib/palettes'
import type { PaidPanel } from '@/lib/types'
import { Button } from '@/components/ui/Button'
import { Accordion } from '@/components/ui/Accordion'
import { InView } from '@/components/ui/InView'
import { ScratchCover } from '@/components/ui/ScratchCover'
import { GridBackdrop } from '@/components/ui/GridBackdrop'

export const metadata: Metadata = {
  title: 'Paid Advertising | Laly Agency',
  description:
    'Pay per qualified lead. We build your website, run your ads, handle your calls, and only send you the leads worth signing.',
}

// Figma 2234:4063 — the /paid-advertising hero, i.e. where Strategy's "The Power of Paid
// Advertisement" card points. Dark ground, photo at 20%, closes on the same 1px keyline the home
// hero uses so the next section butts against it the same way.
//
// Copy comes from the Pages 'paid-advertising' doc (see src/blocks/paid.ts), falling back per block
// to src/lib/mock/paid.ts. Everything below is design, not content: the hero photo and the grid
// texture are part of the layout rather than editable artwork, and the pill tints follow the row
// position like BADGE_COLORS does in Strategy.

// Same 90deg wash on every pill — a warm ember that only reaches full brand pink in the last 15%,
// so the row reads as one gradient sampled four times rather than four separate chips.
const PILL_BG =
  'linear-gradient(90deg, rgba(28,25,23,0.2) 35%, rgba(85,47,42,0.2) 65%, rgba(141,68,60,0.2) 85%, rgba(255,111,97,0.1) 100%)'

// The two ground textures. Static imports rather than Media docs: neither is content — one is the
// hero's 20% photo wash, the other the faint grid behind two sections — and both are decorative
// (empty alt), so there is nothing for an editor to change but the design itself.
const texture = (img: StaticImageData) => ({
  url: img.src,
  width: img.width,
  height: img.height,
  alt: '',
  blurDataURL: img.blurDataURL,
})

// Per-slot mock widths, in layout order. The "what you get" grid is 1 / 2 / 1 with a different
// image width in each slot, so the count is fixed at four (the block enforces it, and
// toWhatYouGetContent falls back to the mock if a panel is ever missing).
const PANEL_WIDTHS = [510, 471, 458, 515]

// Figma's card ground is a conic gradient at 50% layer opacity over solid #292624. The alphas below
// are the design's own, halved — a source-over layer at 0.5 opacity is exactly its alphas halved, so
// this is one background-image instead of a second stacked element.
const STAT_BG =
  'conic-gradient(from 90deg, rgba(255,111,97,0.05) 0%, rgba(28,25,23,0.125) 35%, rgba(85,47,42,0.125) 65%, rgba(141,68,60,0.075) 85%, rgba(255,111,97,0.05) 100%)'

// Figma draws an arrow button in each panel's top-right at opacity 0 — a link that does not exist
// yet. Not rendered: an invisible control is worse than an absent one.
//
// The mocks are flat 2x exports of the Figma widgets (landing page, call-attribution widgets, the
// dashboard, the refund card) — rebuilding those in DOM would mean hundreds of nodes and 1.89px
// Inter text that no browser renders the way Figma does, for artwork nobody interacts with.
// ponytail: exported artwork, not a component library. If one ever needs to be live, replace that
// one image.
function Panel({
  panel,
  width,
  side = false,
  className = '',
}: {
  panel: PaidPanel
  width: number // the slot's mock width at md+; see PANEL_WIDTHS
  side?: boolean // copy and mock share a row at md+, rather than the mock sitting under the copy
  className?: string
}) {
  return (
    <div
      // mobile (2234:3824 and siblings): px 16 / py 40, copy over mock, gap 40 between them
      className={`flex flex-col gap-10 px-4 py-10 md:px-10 md:py-16 ${
        side ? 'md:flex-row md:items-start md:justify-between' : 'md:items-center'
      } ${className}`}
    >
      <div className="flex flex-col gap-5 md:flex-1 md:gap-6">
        {/* heading/h3/m 32 mobile — heading/h3/l 40 desktop; New Spirit / 125% / -0.5px */}
        <h3 className="font-sans text-[32px] leading-[1.25] tracking-[-0.5px] text-[#292624] md:text-[40px]">
          {panel.title}
        </h3>
        {/* body/m 18 mobile — body/l 20 desktop; Neue Haas / 125% / 0.25px */}
        <p className="font-display text-lg font-normal leading-[1.25] tracking-[0.25px] text-[#544D49] md:text-xl">
          {panel.body}
        </p>
      </div>
      {/* the cap is a per-slot number, so it is an inline max-width rather than four arbitrary
          Tailwind classes that only differ by the value */}
      <div className={`w-full ${side ? 'shrink-0' : ''}`} style={{ maxWidth: width }}>
        <MediaImage
          media={panel.image}
          sizes={`(min-width: 1152px) ${width}px, 100vw`}
          className="h-auto w-full"
        />
      </div>
    </div>
  )
}

// Same ISR window as the home page. Both are purged on save anyway (src/lib/revalidate.ts) — this is
// only the backstop, and the two pages share the home doc's contact block, so they should not go
// stale at different times.
export const revalidate = 3600

export default async function PaidAdvertisingPage() {
  // Two docs, one round trip each, in parallel. ponytail: the closing CTA is read off the HOME doc
  // rather than copied — one edit in the admin moves both pages. It does pull the whole home doc for
  // one block; split it when this page needs its own contact copy. Both loaders fall back to their
  // mock per block, so an unreachable Atlas still builds.
  const [{ contact }, paid] = await Promise.all([getHome(), getPaid()])

  return (
    <main>
      {/* .hero-dark is the header's only cue: styles.css flips the shared cream navbar to
          transparent + light logo for any page whose hero opts in. No route check, no scroll JS. */}
      <section
        aria-label="Paid advertising"
        // Figma frame: px 48, pt 0, pb 160, with the header's own 20px padding + 160 gap putting the
        // copy 188px down. The navbar is fixed and out of flow here, so that 188 has to be padding.
        // Mobile (2234:3799): px 20, pb 112, and 20 pad + 28 logo + 112 gap = the copy 160px down.
        className="hero-dark relative flex w-full flex-col overflow-hidden border-b border-[#544D49] bg-[#292624] px-5 pt-[160px] pb-28 sm:px-10 md:px-12 md:pt-[188px] md:pb-40"
      >
        {/* 20% is the design's own opacity — the photo is a texture, not a subject, so it is
            decorative (empty alt) and carries no blur placeholder cost worth paying.
            The crop is off-centre in Figma (the frame sits ~32% down a 4096px-tall portrait), which
            is what keeps the hedge line under the heading instead of the bare sky. */}
        <MediaImage
          media={texture(heroBg)}
          priority
          // 20% over near-black hides re-encode artefacts, so the LCP image doesn't need q100.
          quality={60}
          sizes="100vw"
          className="pointer-events-none absolute inset-0 size-full object-cover object-[50%_32%] opacity-20"
        />

        {/* Figma hero section: px 144 at 1440 -> a 1056 column, same cap the home hero uses. */}
        {/* mobile stacks on a 32px rhythm (Figma "Hero Text Container"), desktop on 24 */}
        <div className="relative mx-auto flex w-full max-w-[1056px] flex-col items-center gap-8 text-center md:gap-6 3xl:max-w-[1200px]">
          {/* Brackets are authored here rather than stored, and not BracketLabel: that component
              spreads its brackets to the row's edges, and this one hugs the words. */}
          <p
            className="entry-copy font-mono text-sm font-normal uppercase leading-[1.4] tracking-[1px] text-[#FF6D6A] md:text-2xl"
            style={{ animationDelay: '0.7s' }}
          >
            [ {paid.hero.label} ]
          </p>

          <h1
            // 338px is Figma's mobile text width, and it is what breaks the line after "when"
            className="hero-heading entry-copy max-w-[338px] font-display text-[44px] font-normal leading-[1.1] tracking-[-1px] text-[#FFFCF9] md:max-w-none md:text-7xl md:font-medium md:leading-none md:tracking-[-1px] 3xl:text-8xl"
            style={{ animationDelay: '0.8s' }}
          >
            {paid.hero.heading}
          </h1>

          {/* 558px is the Figma width, and it is what breaks the four pills 4-up on desktop and
              2-up on a phone — a max, not a fixed width, so it can shrink below it. */}
          <ul
            className="entry-copy flex max-w-[558px] flex-wrap items-center justify-center gap-x-2 gap-y-1.5"
            style={{ animationDelay: '0.95s' }}
          >
            {paid.hero.pills.map((label, i) => (
              <li
                key={label}
                className="flex shrink-0 items-center gap-1 whitespace-nowrap rounded-full px-2.5 py-1 font-display text-[10px] font-normal leading-[1.25] text-[#E7DCD4] md:text-xs shadow-[0_1px_2px_0_rgba(16,24,40,0.04)]"
                style={{ backgroundImage: PILL_BG }}
              >
                {/* star.svg as a mask, same trick as the Strategy badges — one asset, four tints.
                    The tint is the row position, so it cycles rather than coming from the CMS. */}
                <span
                  aria-hidden
                  className="h-[6.5px] w-[6px] shrink-0"
                  style={
                    {
                      backgroundColor: PILL_COLORS[i % PILL_COLORS.length],
                      maskImage: 'url(/star.svg)',
                      maskSize: 'contain',
                      maskRepeat: 'no-repeat',
                      maskPosition: 'center',
                      WebkitMaskImage: 'url(/star.svg)',
                      WebkitMaskSize: 'contain',
                      WebkitMaskRepeat: 'no-repeat',
                      WebkitMaskPosition: 'center',
                    } as CSSProperties
                  }
                />
                {label}
              </li>
            ))}
          </ul>

          <p
            className="hero-desc entry-copy max-w-[338px] font-sans text-xl md:max-w-[880px] font-normal leading-[1.25] text-[#F7F1EE] md:text-[28px]"
            style={{ animationDelay: '1.05s' }}
          >
            {paid.hero.description.before}
            {/* the designer set this phrase in Neue Haas bold at 24 against the 28px serif — a
                deliberate voice change mid-sentence, so the CMS stores the sentence in three parts
                rather than shipping a markup parser */}
            <strong className="font-display text-lg font-bold tracking-[0.25px] md:text-2xl">
              {paid.hero.description.emphasis}
            </strong>
            {paid.hero.description.after}
          </p>

          <div
            className="hero-cta entry-copy flex justify-center"
            style={{ animationDelay: '1.2s' }}
          >
            {/* Figma sets this label at 18px mobile / 20px desktop; the shared Button ships 16/18,
                so it is overridden on the instance exactly like the home hero's CTA. */}
            <Button
              variant="primary"
              href={paid.hero.button.href}
              className="[&>span]:text-lg [&>span]:tracking-[-1px] md:[&>span]:text-xl md:[&>span]:leading-[25px]"
            >
              {paid.hero.button.label}
            </Button>
          </div>
        </div>
      </section>

      {/* Figma 2234:4105 (covered) / 2581:2753 (revealed) — the refund promise, hidden under a
          scratch panel. The band is full-bleed and hugs the revealed copy, which is the taller of
          the two states, so the cover never changes the section's height when it goes.
          The copy is plain DOM: ScratchCover only paints over it. */}
      <section aria-label="Our guarantee" className="relative w-full overflow-hidden bg-[#FCF7F3] px-5 py-12">
        {/* whitespace-pre-line, so the break the editor typed is the break that renders — the
            designer set two lines, it is not a wrap.
            28px at every width: mobile (2581:2753) sets the same heading/h3/s as desktop, so the
            second line runs to the padding on a 375px phone and wraps once more there. */}
        <p className="whitespace-pre-line text-center font-sans text-[28px] leading-[1.25] tracking-[-0.5px] text-[#FF6D6A]">
          {paid.guarantee.body}
        </p>
        <ScratchCover label={paid.guarantee.scratchLabel} />
      </section>

      {/* Figma 2148:498 — "What you get". Cream ground under a faint grid texture, then four
          bordered panels in a 1 / 2 / 1 stack. Borders live on the container and on the row/column
          edges rather than on every panel: Figma gives each panel its own b/l/r, which doubles up to
          2px wherever two panels meet. */}
      <section
        aria-label="What you get"
        // mobile (2234:3818): px 16 / py 48, groups 40 apart
        className="relative w-full overflow-hidden border-t border-[#544D49] bg-[#FCF7F3] px-4 py-12 md:p-28"
      >
        <GridBackdrop />

        <div className="relative mx-auto flex w-full max-w-[1232px] flex-col gap-10 md:gap-12">
          <div className="flex flex-col items-center gap-6 text-center md:gap-8">
            <p className="font-mono text-sm font-normal uppercase leading-[1.4] tracking-[1px] text-[#867A72] md:text-2xl">
              [ {paid.whatYouGet.label} ]
            </p>
            {/* heading/h1/xs 40 mobile — heading/h1/xl 64 desktop; Neue Haas 450 (→400, only
                400/500/700 ship) / 110% / -1px. 876px is Figma's own width, and it is what puts the
                break after "and". */}
            <h2 className="max-w-[876px] font-display text-[40px] font-normal leading-[1.1] tracking-[-1px] text-[#262626] md:text-[64px]">
              {paid.whatYouGet.heading}
            </h2>
          </div>

          {/* The four panels are indexed, not mapped: the 1 / 2 / 1 arrangement and the borders
              between the slots are the design, so the shape stays in the markup and only the copy
              and the mock come from the CMS. */}
          <div className="w-full border border-[#E7DCD4] bg-[#FFFCF9]">
            <Panel side panel={paid.whatYouGet.panels[0]} width={PANEL_WIDTHS[0]} />

            <div className="grid border-t border-[#E7DCD4] md:grid-cols-2">
              <Panel panel={paid.whatYouGet.panels[1]} width={PANEL_WIDTHS[1]} />
              <Panel
                className="border-t border-[#E7DCD4] md:border-t-0 md:border-l"
                panel={paid.whatYouGet.panels[2]}
                width={PANEL_WIDTHS[2]}
              />
            </div>

            <Panel
              side
              className="border-t border-[#E7DCD4]"
              panel={paid.whatYouGet.panels[3]}
              width={PANEL_WIDTHS[3]}
            />
          </div>
        </div>
      </section>

      {/* Figma 2488:822 — "The numbers speak." Three stat cards on the dark ground.
          Cards enter left-to-right on the same clock as the Strategy pillars: InView's media gate
          plus a 0.2s-per-card inline delay. */}
      {/* mobile (2234:3922): px 20, pt 48 / pb 96, 64 to the cards, cards 24 apart */}
      <section
        aria-label="Results"
        className="w-full bg-[#292624] px-5 pt-12 pb-24 md:px-20 md:py-28"
      >
        <InView className="mx-auto flex w-full max-w-[1280px] flex-col gap-16">
          <div className="flex flex-col gap-6 text-center">
            <p className="section-text-reveal font-mono text-sm font-normal uppercase leading-[1.4] tracking-[1px] text-[#FF6D6A] md:text-2xl">
              [ {paid.results.label} ]
            </p>
            <h2 className="section-text-reveal font-display text-[40px] font-normal leading-[1.1] tracking-[-1px] text-[#FCF7F3] md:text-[64px]">
              {paid.results.heading}
            </h2>
          </div>

          <div className="grid gap-6 md:grid-cols-3 md:gap-8">
            {paid.results.stats.map((stat, i) => (
              <div
                key={stat.value}
                // the inline animation-delay longhand beats the stylesheet's `animation` shorthand,
                // which is what staggers these left→right — same numbers as Strategy's pillars
                className="section-media-reveal flex flex-col gap-4 rounded px-4 py-6 text-center"
                style={{ backgroundImage: STAT_BG, animationDelay: `${0.2 + i * 0.2}s` }}
              >
                <p className="font-sans text-[72px] leading-[1.25] tracking-[-0.5px] text-[#FF6D6A] md:text-[96px]">
                  {stat.value}
                </p>
                {/* the authored \n is a desktop break only — mobile (2234:3929) lets the same copy
                    wrap to the card, and a newline collapses to a space under whitespace-normal */}
                <p className="whitespace-normal font-sans text-xl leading-[1.25] text-[#FCF7F3] opacity-85 md:whitespace-pre-line md:text-[28px]">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </InView>
      </section>

      {/* Figma 2329:4221 — Pricing. Two cards; the second carries the brand keyline, a glow, and the
          "pay as they come in" tab straddling its top edge. */}
      <section
        aria-label="Pricing"
        // mobile (2571:2660): px 20, pt 48 / pb 96, cards 24 apart
        className="w-full border-t-[0.5px] border-[#867A72] bg-[#FCF7F3] px-5 pt-12 pb-24 md:px-40 md:py-28"
      >
        <div className="mx-auto flex w-full max-w-[1120px] flex-col gap-16">
          <div className="flex flex-col gap-6 text-center">
            <p className="font-mono text-sm font-normal uppercase leading-[1.4] tracking-[1px] text-[#867A72] md:text-2xl">
              [ {paid.pricing.label} ]
            </p>
            {/* the break after "Transparent." is authored, not a wrap — whitespace-pre-line keeps
                the editor's Enter */}
            <h2 className="whitespace-pre-line font-display text-[40px] font-normal leading-[1.1] tracking-[-1px] text-[#262626] md:text-[64px]">
              {paid.pricing.heading}
            </h2>
          </div>

          {/* items-stretch (grid's default) is what lets the shorter card match the taller one, and
              justify-between then parks both CTAs on the same line */}
          <div className="grid gap-6 md:grid-cols-2 md:gap-8">
            {paid.pricing.tiers.map((tier) => (
              <div
                key={tier.label}
                className={`relative flex flex-col justify-between gap-8 border bg-[#FFFCF9] px-4 py-6 md:gap-10 md:p-10 ${
                  tier.badge
                    ? 'border-[#FF6D6A] shadow-[0_0_6px_0_rgba(66,55,48,0.2),1px_1px_6px_0_rgba(66,55,48,0.2)]'
                    : 'border-[#E7DCD4]'
                }`}
              >
                {tier.badge && (
                  // straddles the keyline near the right edge — Figma pins it at left:372 on a
                  // fixed-width card, which is that inset measured from the wrong side
                  <span className="absolute -top-3 right-4 rounded-full bg-[#FF6D6A] px-1.5 py-1 font-fira text-xs leading-[1.25] tracking-[-1px] text-[#292624] shadow-[0_1px_2px_0_rgba(16,24,40,0.04)] md:right-10 md:text-base">
                    {tier.badge}
                  </span>
                )}

                <div className="flex flex-col gap-8">
                  <div className="flex flex-col gap-4">
                    {/* body/l — Neue Haas 20 / 125% / 0.25px, both widths */}
                    <p className="font-display text-xl font-normal leading-[1.25] tracking-[0.25px] text-[#867A72]">
                      {tier.label}
                    </p>
                    <p className="font-sans text-[64px] leading-[1.25] tracking-[-0.5px] text-[#262626] md:text-[72px]">
                      {tier.price}
                    </p>
                  </div>
                  <ul className="ml-[30px] list-disc font-sans text-xl leading-[1.5] text-[#4A4A4A] md:ml-9 md:text-2xl">
                    {tier.items.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>

                <div className="flex">
                  {/* Figma sets this label at 18px mobile / 20px desktop; the Button ships 16/18 */}
                  <Button
                    href={paid.pricing.cta.href}
                    className="[&>span]:text-lg [&>span]:tracking-[-1px] md:[&>span]:text-xl md:[&>span]:leading-[25px]"
                  >
                    {paid.pricing.cta.label}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Figma 2458:5950 — FAQ. Same cream + grid texture ground as "What you get".
          Rows are the client <Accordion>: native <details> cannot animate its own open/close outside
          Chromium, and the panel has to slide at both widths. Everything else here stays server. */}
      <section
        aria-label="FAQ"
        // mobile (2739:9048): px 20, pt 48 / pb 96, 32 between the header and the container
        className="relative w-full overflow-hidden border-y border-[#544D49] bg-[#FCF7F3] px-5 pt-12 pb-24 md:px-40 md:py-28"
      >
        <GridBackdrop />

        <div className="relative mx-auto flex w-full max-w-[1120px] flex-col gap-8 md:gap-12">
          <div className="flex flex-col gap-6 text-center">
            <p className="font-mono text-sm font-normal uppercase leading-[1.4] tracking-[1px] text-[#867A72] md:text-2xl">
              [ {paid.faq.label} ]
            </p>
            <h2 className="font-display text-[40px] font-normal leading-[1.1] tracking-[-1px] text-[#292624] md:text-[56px]">
              {paid.faq.heading}
            </h2>
          </div>

          <div className="flex w-full flex-col gap-4 border border-[#E7DCD4] bg-[#FFFCF9] px-3 py-6 md:p-6">
            {paid.faq.items.map((faq, i) => (
              <Accordion
                // the placeholder rows are identical copy, so the index is the only stable key
                key={i}
                id={`faq-${i}`}
                question={faq.question}
                answer={faq.answer}
                // last row drops the rule — Figma ends the stack on the container's own border
                className={`px-4 py-6 ${
                  i < paid.faq.items.length - 1 ? 'border-b border-[#E7DCD4]' : ''
                }`}
              />
            ))}
          </div>
        </div>
      </section>

      <Contact content={contact} />

      {/* Figma 2148:620 — the same dark qualifier band the home page closes on, reusing the same
          `note` block from this page's own doc: the copy is page-specific, the shape is not.
          458 is Figma's text width, and it is what breaks the line after "have". */}
      <Note content={paid.note} className="mx-auto max-w-[458px]" />
    </main>
  )
}
