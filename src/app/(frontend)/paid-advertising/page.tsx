import type { Metadata } from 'next'
import type { CSSProperties } from 'react'
import heroBg from '../../../../public/paid-advertising/hero.webp'
import { MediaImage } from '@/components/Media/Image'
import { Button } from '@/components/ui/Button'

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

export default function PaidAdvertisingPage() {
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
    </main>
  )
}
