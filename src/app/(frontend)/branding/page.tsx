import type { Metadata } from 'next'
import heroBg from '../../../../public/branding/hero.webp'
import { BrandSystem } from '@/components/sections/BrandSystem'
import { Channels } from '@/components/sections/Channels'
import { CompoundEffect } from '@/components/sections/CompoundEffect'
import Contact from '@/components/sections/Contact'
import { Faq } from '@/components/sections/Faq'
import Note from '@/components/sections/Note'
import { Pricing } from '@/components/sections/Pricing'
import { ScratchBand } from '@/components/sections/ScratchBand'
import { ServiceHero } from '@/components/sections/ServiceHero'
import { getHome } from '@/lib/cms'
import { branding } from '@/lib/mock/branding'

export const metadata: Metadata = {
  title: 'Branding | Laly Agency',
  description:
    'A visibility system across search, social, and the physical world — so your brand becomes the default choice before prospects ever need you.',
}

// Same ISR window as the other two pages, so they never go stale at different times.
export const revalidate = 3600

// Figma 2724:3346 — where Strategy's "The Power of Branding" card points.
//
// Copy comes straight from src/lib/mock/branding.ts: there is no Pages 'branding' doc or block yet,
// so there is nothing to fall back FROM. Wire it the way /paid-advertising is once the whole page
// exists, rather than adding a block per section as each one ships.
//
// The closing CTA is the exception — it is read off the HOME doc, exactly as /paid-advertising does
// it, so one edit in the admin moves all three pages.
export default async function BrandingPage() {
  const { contact } = await getHome()

  return (
    <main>
      <ServiceHero content={branding.hero} image={heroBg} label="Branding" />

      {/* Figma 2724:4151 — the positioning line, under the same scratch panel the refund promise
          gets on /paid-advertising. */}
      <ScratchBand label="Brand versus paid ads" scratchLabel={branding.positioning.scratchLabel}>
        {branding.positioning.body.before}
        {/* Neue Haas 65 Medium at 24 against the 28px serif — medium here, where the heroes go bold */}
        <strong className="font-display text-2xl font-medium tracking-[0.25px]">
          {branding.positioning.body.emphasis}
        </strong>
        {branding.positioning.body.after}
      </ScratchBand>

      <BrandSystem content={branding.system} />

      <Channels content={branding.channels} />

      <CompoundEffect content={branding.compound} />

      <Pricing content={branding.pricing} />

      <Faq content={branding.faq} />

      {/* Figma draws Contact identically to /paid-advertising's, so it reads the same home doc. */}
      <Contact content={contact} />

      {/* Same closing band as /paid-advertising, down to the 458px column — which is what puts the
          break after "brand" that the copy also sets by hand. */}
      <Note content={branding.note} className="mx-auto max-w-[458px]" />
    </main>
  )
}
