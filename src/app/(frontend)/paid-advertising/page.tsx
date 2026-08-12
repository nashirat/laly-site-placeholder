import type { Metadata } from 'next'
import type { CSSProperties, ReactNode } from 'react'
import type { StaticImageData } from 'next/image'
import callsShot from '../../../../public/paid-advertising/calls.webp'
import dashboardShot from '../../../../public/paid-advertising/dashboard.webp'
import gridTexture from '../../../../public/paid-advertising/grid.webp'
import heroBg from '../../../../public/paid-advertising/hero.webp'
import refundShot from '../../../../public/paid-advertising/refund.webp'
import websiteShot from '../../../../public/paid-advertising/website.webp'
import { MediaImage } from '@/components/Media/Image'
import Contact from '@/components/sections/Contact'
import Note from '@/components/sections/Note'
import { getHome } from '@/lib/cms'
import { Button } from '@/components/ui/Button'
import { InView } from '@/components/ui/InView'
import { ScratchCover } from '@/components/ui/ScratchCover'
import ChevronDown from '../../../../public/chevron-down.svg'

export const metadata: Metadata = {
  title: 'Paid Advertising | Laly Agency',
  description:
    'Pay per qualified lead. We build your website, run your ads, handle your calls, and only send you the leads worth signing.',
}

// Figma 2234:4063 — the /paid-advertising hero, i.e. where Strategy's "The Power of Paid
// Advertisement" card points. Dark ground, photo at 20%, closes on the same 1px keyline the home
// hero uses so the next section (not designed yet) butts against it the same way.
//
// ponytail: copy lives here, not in Payload. Only the home Hero block is modelled (see the phase-1
// note) and this page has no editor asking for it yet — wire it when someone needs to change a word
// without a deploy.
//
// The star tints are layout, not content: the trio cycles down the row like BADGE_COLORS does in
// Strategy, with a fourth added for the fourth pill.
const PILLS = [
  { label: 'Google Ads', color: '#A2A11C' },
  { label: 'Microsoft Ads', color: '#CBB1C9' },
  { label: 'Tik Tok Ads', color: '#FF8A88' },
  { label: 'Meta Ads', color: '#F5C882' },
]

// Same 90deg wash on every pill — a warm ember that only reaches full brand pink in the last 15%,
// so the row reads as one gradient sampled four times rather than four separate chips.
const PILL_BG =
  'linear-gradient(90deg, rgba(28,25,23,0.2) 35%, rgba(85,47,42,0.2) 65%, rgba(141,68,60,0.2) 85%, rgba(255,111,97,0.1) 100%)'

// The four "what you get" panels each pair copy with a product mock. The mocks are flat 2x PNG
// exports of the Figma widgets (landing page, call-attribution widgets, the dashboard, the refund
// card), re-encoded to webp — rebuilding those in DOM would mean hundreds of nodes and 1.89px Inter
// text that no browser renders the way Figma does, for artwork nobody interacts with.
// ponytail: exported artwork, not a component library. If one ever needs to be live, replace that
// one <img>.
const shot = (img: StaticImageData, alt: string) => ({
  url: img.src,
  width: img.width,
  height: img.height,
  alt,
  blurDataURL: img.blurDataURL,
})

// Figma's card ground is a conic gradient at 50% layer opacity over solid #292624. The alphas below
// are the design's own, halved — a source-over layer at 0.5 opacity is exactly its alphas halved, so
// this is one background-image instead of a second stacked element.
const STAT_BG =
  'conic-gradient(from 90deg, rgba(255,111,97,0.05) 0%, rgba(28,25,23,0.125) 35%, rgba(85,47,42,0.125) 65%, rgba(141,68,60,0.075) 85%, rgba(255,111,97,0.05) 100%)'

// The \n is the designer's break, not a wrap — both lines are set by hand.
const STATS = [
  { value: '31', label: 'Qualified leads generated in a\nsingle month for one client' },
  { value: '$0', label: "What you owe\nif we don't deliver in 6 months" },
  { value: '100%', label: 'Of our revenue\ntied to your results' },
]

const PRICING = [
  {
    label: 'One-time Setup',
    price: '$20,000',
    items: [
      'Business audit',
      'Custom Scaling Roadmap',
      'Full Website Build',
      'Campaign Architecture',
      'Tracking Infrastructure',
      'Call Handling Setup',
      'Reporting Dashboard',
    ],
  },
  {
    label: 'Per Qualified Lead',
    price: '$1,500',
    badge: 'PAY AS THEY COME IN',
    items: [
      'Only qualified leads that pass our filter and match the criteria we agreed on.',
      'You review every lead in your dashboard.',
      'Dispute any you disagree with.',
      'Pay as they come in.',
    ],
  },
]

// ponytail: the Figma FAQ is five lorem rows with one lorem answer — the copy has not been written.
// Shipped verbatim rather than invented, so nobody mistakes filler for approved copy. Swap q/a here.
const FAQS = [
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit?',
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit?',
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit?',
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit?',
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit?',
].map((question) => ({
  question,
  answer: 'This is subtext which appears after expanding the accordion.',
}))

// Figma draws an arrow button in each panel's top-right at opacity 0 — a link that does not exist
// yet. Not rendered: an invisible control is worse than an absent one.
function Panel({
  title,
  body,
  media,
  side = false,
  className = '',
}: {
  title: string
  body: string
  media: ReactNode
  side?: boolean // copy and mock share a row at md+, rather than the mock sitting under the copy
  className?: string
}) {
  return (
    <div
      className={`flex flex-col gap-10 px-5 py-12 md:px-10 md:py-16 ${
        side ? 'md:flex-row md:items-start md:justify-between' : 'md:items-center'
      } ${className}`}
    >
      <div className="flex flex-col gap-6 md:flex-1">
        {/* heading/h3/l — New Spirit 40 / 125% / -0.5px */}
        <h3 className="font-sans text-[28px] leading-[1.25] tracking-[-0.5px] text-[#292624] md:text-[40px]">
          {title}
        </h3>
        {/* body/l — Neue Haas 20 / 125% / 0.25px */}
        <p className="font-display text-base font-normal leading-[1.25] tracking-[0.25px] text-[#544D49] md:text-xl">
          {body}
        </p>
      </div>
      {media}
    </div>
  )
}

// Same ISR window as the home page — the closing Contact block is the only CMS-backed thing here,
// and it is the same document, so the two pages should not go stale at different times.
export const revalidate = 3600

export default async function PaidAdvertisingPage() {
  // ponytail: the closing CTA is read off the home doc rather than copied. One edit in the admin
  // moves both pages. getHome falls back to the mock per block, so an unreachable Atlas still
  // builds — but it does pull the whole page doc for one block. Split it when a second page needs
  // its own contact copy.
  const { contact } = await getHome()

  return (
    <main>
      {/* .hero-dark is the header's only cue: styles.css flips the shared cream navbar to
          transparent + light logo for any page whose hero opts in. No route check, no scroll JS. */}
      <section
        aria-label="Paid advertising"
        // Figma frame: px 48, pt 0, pb 160, with the header's own 20px padding + 160 gap putting the
        // copy 188px down. The navbar is fixed and out of flow here, so that 188 has to be padding.
        className="hero-dark relative flex w-full flex-col overflow-hidden border-b border-[#544D49] bg-[#292624] px-5 pt-[124px] pb-20 sm:px-10 md:px-12 md:pt-[188px] md:pb-40"
      >
        {/* 20% is the design's own opacity — the photo is a texture, not a subject, so it is
            decorative (empty alt) and carries no blur placeholder cost worth paying.
            The crop is off-centre in Figma (the frame sits ~32% down a 4096px-tall portrait), which
            is what keeps the hedge line under the heading instead of the bare sky. */}
        <MediaImage
          media={{
            url: heroBg.src,
            width: heroBg.width,
            height: heroBg.height,
            alt: '',
            blurDataURL: heroBg.blurDataURL,
          }}
          priority
          // 20% over near-black hides re-encode artefacts, so the LCP image doesn't need q100.
          quality={60}
          sizes="100vw"
          className="pointer-events-none absolute inset-0 size-full object-cover object-[50%_32%] opacity-20"
        />

        {/* Figma hero section: px 144 at 1440 -> a 1056 column, same cap the home hero uses. */}
        <div className="relative mx-auto flex w-full max-w-[1056px] flex-col items-center gap-6 text-center 3xl:max-w-[1200px]">
          {/* Brackets are authored characters here, not BracketLabel: that component spreads its
              brackets to the row's edges, and this one hugs the words. */}
          <p
            className="entry-copy font-mono text-base font-normal uppercase leading-[1.4] tracking-[0.06em] text-[#FF6D6A] md:text-2xl md:tracking-[1px]"
            style={{ animationDelay: '0.7s' }}
          >
            [ Pay Per Performance ]
          </p>

          <h1
            className="hero-heading entry-copy font-display text-[44px] font-normal leading-[1.1] tracking-tight text-[#FFFCF9] md:text-7xl md:font-medium md:leading-none md:tracking-[-1px] 3xl:text-8xl"
            style={{ animationDelay: '0.8s' }}
          >
            You only pay when we deliver.
          </h1>

          {/* 558px is the Figma width, and it is what breaks the four pills 4-up on desktop and
              2-up on a phone — a max, not a fixed width, so it can shrink below it. */}
          <ul
            className="entry-copy flex max-w-[558px] flex-wrap items-center justify-center gap-x-2 gap-y-1.5"
            style={{ animationDelay: '0.95s' }}
          >
            {PILLS.map((pill) => (
              <li
                key={pill.label}
                className="flex shrink-0 items-center gap-1 whitespace-nowrap rounded-full px-2.5 py-1 font-display text-xs font-normal leading-[1.25] text-[#E7DCD4] shadow-[0_1px_2px_0_rgba(16,24,40,0.04)]"
                style={{ backgroundImage: PILL_BG }}
              >
                {/* star.svg as a mask, same trick as the Strategy badges — one asset, four tints */}
                <span
                  aria-hidden
                  className="h-[6.5px] w-[6px] shrink-0"
                  style={
                    {
                      backgroundColor: pill.color,
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
                {pill.label}
              </li>
            ))}
          </ul>

          <p
            className="hero-desc entry-copy max-w-[880px] font-sans text-xl font-normal leading-[1.25] text-[#F7F1EE] md:text-[28px]"
            style={{ animationDelay: '1.05s' }}
          >
            We build your website, run your ads, handle your calls, filter your leads, and only send
            you the ones worth signing.{' '}
            {/* the designer set this phrase in Neue Haas bold at 24 against the 28px serif — a
                deliberate voice change mid-sentence, so it is markup rather than a token */}
            <strong className="font-display text-lg font-bold tracking-[0.25px] md:text-2xl">
              You pay per qualified lead
            </strong>
            . If we don&rsquo;t deliver in 6 months, you get your setup fee back.
          </p>

          <div
            className="hero-cta entry-copy flex justify-center"
            style={{ animationDelay: '1.2s' }}
          >
            {/* Figma sets this label at 20px; the shared Button ships 16/18, so it is overridden on
                the instance exactly like the home hero's CTA. */}
            <Button variant="primary" className="md:[&>span]:text-xl md:[&>span]:leading-[25px]">
              LET&rsquo;S BEGIN
            </Button>
          </div>
        </div>
      </section>

      {/* Figma 2234:4105 (covered) / 2581:2753 (revealed) — the refund promise, hidden under a
          scratch panel. The band is full-bleed and hugs the revealed copy, which is the taller of
          the two states, so the cover never changes the section's height when it goes.
          The copy is plain DOM: ScratchCover only paints over it. */}
      <section aria-label="Our guarantee" className="relative w-full overflow-hidden bg-[#FCF7F3] px-5 py-12">
        {/* the break is authored — the designer set two lines, it is not a wrap */}
        <p className="text-center font-sans text-2xl leading-[1.25] tracking-[-0.5px] text-[#FF6D6A] md:text-[28px]">
          Zero leads in 6 months?
          <br />
          Full refund. No questions asked.
        </p>
        <ScratchCover label="Scratch To Reveal" />
      </section>

      {/* Figma 2148:498 — "What you get". Cream ground under a faint grid texture, then four
          bordered panels in a 1 / 2 / 1 stack. Borders live on the container and on the row/column
          edges rather than on every panel: Figma gives each panel its own b/l/r, which doubles up to
          2px wherever two panels meet. */}
      <section
        aria-label="What you get"
        className="relative w-full overflow-hidden border-t border-[#544D49] bg-[#FCF7F3] px-5 py-16 md:p-28"
      >
        <MediaImage
          media={shot(gridTexture, '')}
          quality={60}
          sizes="100vw"
          className="pointer-events-none absolute inset-0 size-full object-cover opacity-15"
        />

        <div className="relative mx-auto flex w-full max-w-[1232px] flex-col gap-12">
          <div className="flex flex-col items-center gap-8 text-center">
            <p className="font-mono text-base font-normal uppercase leading-[1.4] tracking-[0.06em] text-[#867A72] md:text-2xl md:tracking-[1px]">
              [ What You Get ]
            </p>
            {/* heading/h1/xl — Neue Haas 450 (→400, only 400/500/700 ship) / 64 / 110% / -1px.
                876px is Figma's own width, and it is what puts the break after "and". */}
            <h2 className="max-w-[876px] font-display text-[36px] font-normal leading-[1.1] tracking-[-1px] text-[#262626] md:text-[64px]">
              Everything built, managed, and filtered for you.
            </h2>
          </div>

          <div className="w-full border border-[#E7DCD4] bg-[#FFFCF9]">
            <Panel
              side
              title="A brand new website, built to convert."
              body="Included in your setup fee. We design and develop a conversion-optimized website from scratch: fast, mobile-first, and engineered specifically to turn ad clicks into phone calls and form submissions. No templates. No DIY builders. A custom site built for your practice."
              media={
                <MediaImage
                  media={shot(websiteShot, 'Preview of a conversion-optimised landing page')}
                  sizes="(min-width: 1152px) 510px, 100vw"
                  className="h-auto w-full max-w-[510px] shrink-0"
                />
              }
            />

            <div className="grid border-t border-[#E7DCD4] md:grid-cols-2">
              <Panel
                title="We answer every call and filter every lead."
                body="Our team handles every inbound call and form submission generated by your campaigns. We qualify each one using criteria we define together at onboarding. Junk calls, tire kickers, wrong practice area? We filter them out. You only hear from leads worth your time."
                media={
                  <MediaImage
                    media={shot(callsShot, 'Call attribution breakdown and total call count widgets')}
                    sizes="(min-width: 1152px) 471px, 100vw"
                    className="h-auto w-full max-w-[471px]"
                  />
                }
              />
              <Panel
                className="border-t border-[#E7DCD4] md:border-t-0 md:border-l"
                title="A real-time dashboard to track, dispute, and pay as you go."
                body="No surprise invoices. Your dashboard shows every lead as it comes in, with full transparency. See your lead count, review details, dispute any lead you disagree with, and pay throughout the month. You're always in control of what you owe."
                media={
                  <MediaImage
                    media={shot(dashboardShot, 'Lead dashboard showing call volume over time')}
                    sizes="(min-width: 1152px) 458px, 100vw"
                    className="h-auto w-full max-w-[458px]"
                  />
                }
              />
            </div>

            <Panel
              side
              className="border-t border-[#E7DCD4]"
              title="Money-back guarantee. Zero risk."
              body="If we don't generate a single qualified lead within 6 months of campaign launch, your $20,000 setup fee is refunded in full. You maintain your minimum ad spend, we do the rest. If it doesn't work, you walk away whole."
              media={
                <MediaImage
                  media={shot(refundShot, 'Full refund card marked zero risk')}
                  sizes="(min-width: 1152px) 515px, 100vw"
                  className="h-auto w-full max-w-[515px] shrink-0"
                />
              }
            />
          </div>
        </div>
      </section>

      {/* Figma 2488:822 — "The numbers speak." Three stat cards on the dark ground.
          Cards enter left-to-right on the same clock as the Strategy pillars: InView's media gate
          plus a 0.2s-per-card inline delay. */}
      <section aria-label="Results" className="w-full bg-[#292624] px-5 py-16 md:px-20 md:py-28">
        <InView className="mx-auto flex w-full max-w-[1280px] flex-col gap-16">
          <div className="flex flex-col gap-6 text-center">
            <p className="section-text-reveal font-mono text-base font-normal uppercase leading-[1.4] tracking-[0.06em] text-[#FF6D6A] md:text-2xl md:tracking-[1px]">
              [ Results ]
            </p>
            <h2 className="section-text-reveal font-display text-[36px] font-normal leading-[1.1] tracking-[-1px] text-[#FCF7F3] md:text-[64px]">
              The numbers speak.
            </h2>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            {STATS.map((stat, i) => (
              <div
                key={stat.value}
                // the inline animation-delay longhand beats the stylesheet's `animation` shorthand,
                // which is what staggers these left→right — same numbers as Strategy's pillars
                className="section-media-reveal flex flex-col gap-4 rounded px-4 py-6 text-center"
                style={{ backgroundImage: STAT_BG, animationDelay: `${0.2 + i * 0.2}s` }}
              >
                <p className="font-sans text-[64px] leading-[1.25] tracking-[-0.5px] text-[#FF6D6A] md:text-[96px]">
                  {stat.value}
                </p>
                <p className="whitespace-pre-line font-sans text-xl leading-[1.25] text-[#FCF7F3] opacity-85 md:text-[28px]">
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
        className="w-full border-t-[0.5px] border-[#867A72] bg-[#FCF7F3] px-5 py-16 md:px-40 md:py-28"
      >
        <div className="mx-auto flex w-full max-w-[1120px] flex-col gap-16">
          <div className="flex flex-col gap-6 text-center">
            <p className="font-mono text-base font-normal uppercase leading-[1.4] tracking-[0.06em] text-[#867A72] md:text-2xl md:tracking-[1px]">
              [ Pricing ]
            </p>
            {/* the break after "Transparent." is authored, not a wrap */}
            <h2 className="whitespace-pre-line font-display text-[36px] font-normal leading-[1.1] tracking-[-1px] text-[#262626] md:text-[64px]">
              {'Simple. Transparent.\nPerformance-based.'}
            </h2>
          </div>

          {/* items-stretch (grid's default) is what lets the shorter card match the taller one, and
              justify-between then parks both CTAs on the same line */}
          <div className="grid gap-8 md:grid-cols-2">
            {PRICING.map((tier) => (
              <div
                key={tier.label}
                className={`relative flex flex-col justify-between gap-10 border bg-[#FFFCF9] p-6 md:p-10 ${
                  tier.badge
                    ? 'border-[#FF6D6A] shadow-[0_0_6px_0_rgba(66,55,48,0.2),1px_1px_6px_0_rgba(66,55,48,0.2)]'
                    : 'border-[#E7DCD4]'
                }`}
              >
                {tier.badge && (
                  // straddles the keyline near the right edge — Figma pins it at left:372 on a
                  // fixed-width card, which is that inset measured from the wrong side
                  <span className="absolute -top-3 right-6 rounded-full bg-[#FF6D6A] px-1.5 py-1 font-fira text-xs leading-[1.25] tracking-[-1px] text-[#292624] shadow-[0_1px_2px_0_rgba(16,24,40,0.04)] md:right-10 md:text-base">
                    {tier.badge}
                  </span>
                )}

                <div className="flex flex-col gap-8">
                  <div className="flex flex-col gap-4">
                    {/* body/l — Neue Haas 20 / 125% / 0.25px */}
                    <p className="font-display text-base font-normal leading-[1.25] tracking-[0.25px] text-[#867A72] md:text-xl">
                      {tier.label}
                    </p>
                    <p className="font-sans text-5xl leading-[1.25] tracking-[-0.5px] text-[#262626] md:text-[72px]">
                      {tier.price}
                    </p>
                  </div>
                  <ul className="ml-6 list-disc font-sans text-lg leading-[1.5] text-[#4A4A4A] md:ml-9 md:text-2xl">
                    {tier.items.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>

                <div className="flex">
                  {/* Figma sets this label at 20px; the shared Button ships 16/18 */}
                  <Button className="md:[&>span]:text-xl md:[&>span]:leading-[25px]">
                    BOOK A CALL
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Figma 2458:5950 — FAQ. Same cream + grid texture ground as "What you get".
          ponytail: native <details>/<summary>, so this stays a server component — the disclosure
          state, keyboard handling and aria-expanded are the browser's, not ours. The cost is no
          height transition (only Chromium animates ::details-content today) and no
          one-open-at-a-time; neither is in the design. */}
      <section
        aria-label="FAQ"
        className="relative w-full overflow-hidden border-y border-[#544D49] bg-[#FCF7F3] px-5 py-16 md:px-40 md:py-28"
      >
        <MediaImage
          media={shot(gridTexture, '')}
          quality={60}
          sizes="100vw"
          className="pointer-events-none absolute inset-0 size-full object-cover opacity-15"
        />

        <div className="relative mx-auto flex w-full max-w-[1120px] flex-col gap-12">
          <div className="flex flex-col gap-6 text-center">
            <p className="font-mono text-base font-normal uppercase leading-[1.4] tracking-[0.06em] text-[#867A72] md:text-2xl md:tracking-[1px]">
              [ FAQ ]
            </p>
            <h2 className="font-display text-[36px] font-normal leading-[1.1] tracking-[-1px] text-[#292624] md:text-[56px]">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="flex w-full flex-col gap-4 border border-[#E7DCD4] bg-[#FFFCF9] p-4 md:p-6">
            {FAQS.map((faq, i) => (
              <details
                // identical placeholder questions, so the index is the only stable key
                key={i}
                // last row drops the rule — Figma ends the stack on the container's own border
                className={`group px-2 py-6 md:px-4 ${
                  i < FAQS.length - 1 ? 'border-b border-[#E7DCD4]' : ''
                }`}
              >
                <summary className="flex cursor-pointer list-none items-center justify-between gap-3 [&::-webkit-details-marker]:hidden">
                  {/* body-2/xl — New Spirit 24 / 125% */}
                  <span className="font-sans text-lg leading-[1.25] text-[#292624] md:text-2xl">
                    {faq.question}
                  </span>
                  {/* the chevron flips rather than swapping to Figma's separate cheveron-up node —
                      same glyph mirrored, and it can then transition */}
                  <ChevronDown
                    aria-hidden
                    className="h-[6.5px] w-[11.5px] shrink-0 transition-transform duration-300 ease-out group-open:rotate-180"
                  />
                </summary>
                {/* body-2/m — New Spirit 18 / 125% / #867A72 */}
                <p className="mt-5 font-sans text-base leading-[1.25] text-[#867A72] md:text-lg">
                  {faq.answer}
                </p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <Contact content={contact} />

      {/* Figma 2148:620 — the same dark qualifier band the home page closes on, with this page's own
          copy. Not from the CMS: the home doc's note block says something else, and this one is
          page-specific. 458 is Figma's text width, and it is what breaks the line after "have". */}
      <Note
        content={{
          body: "We're looking for firms ready to scale. If you have the ad budget and want leads that actually convert, let's talk.",
        }}
        className="mx-auto max-w-[458px]"
      />
    </main>
  )
}
