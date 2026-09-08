import type { Metadata } from 'next'
import heroBg from '../../../../public/development/hero.webp'
import Contact from '@/components/sections/Contact'
import { Faq } from '@/components/sections/Faq'
import Note from '@/components/sections/Note'
import { Pricing } from '@/components/sections/Pricing'
import { ServiceHero } from '@/components/sections/ServiceHero'
import { SectionFade } from '@/components/ui/SectionFade'
import { getDevelopment, getHome } from '@/lib/cms'

export const metadata: Metadata = {
  title: 'Development | Laly Agency',
  description:
    'Custom software built around how your business actually works — not the third-party tools you have been forced to fit into.',
}

// Same ISR window as the other three pages, so they never go stale at different times.
export const revalidate = 3600

// Figma 3292:4643 — where Strategy's "The Power of Technology" card points.
//
// The shortest of the three service pages, and deliberately so: the frame draws the hero, Pricing,
// FAQ, Contact and the closing band and NOTHING between the hero and Pricing. The sections that
// /paid-advertising and /branding fill that gap with have not been designed for this page yet, so
// nothing stands in for them — the route exists and is navigable, and the middle gets added when the
// frames land.
//
// Every block here is one another page already draws (paidHero/pricing/faq/note), so this page adds
// no components and no CMS blocks — only the 'development' doc that carries its own rows. Copy comes
// from that doc, falling back per block to src/lib/mock/development.ts (see getDevelopment in
// src/lib/cms.ts).
//
// The hero photo is a static import, as on /branding: it is the layout's 20% wash rather than
// artwork an editor would swap.
//
// The closing CTA is read off the HOME doc, exactly as the other two do it, so one edit in the admin
// moves all three pages.
//
// Every section but the hero is wrapped in <SectionFade>: one opacity ramp per section, tripped by
// its own observer as it comes on screen. The hero is above the fold, so it has nothing to fade in
// from.
export default async function DevelopmentPage() {
  const [{ contact }, development] = await Promise.all([getHome(), getDevelopment()])

  return (
    <main>
      {/* No crop nudge, unlike the other two heroes: those photos are tall portraits that have to be
          pushed into a short band, and this one is exported from Figma already framed at 16:9 — so
          centring it IS the design's crop. */}
      <ServiceHero
        content={development.hero}
        image={heroBg}
        label="Development"
        objectPosition="object-center"
      />

      {/* Figma 3292:4806 — identical to the Pricing block on the other two service pages, carrying
          this doc's own rows. It opens on the same 0.5px keyline, so it butts against the hero the
          way "What you get" does on /paid-advertising. */}
      <SectionFade>
        <Pricing content={development.pricing} />
      </SectionFade>

      <SectionFade>
        <Faq content={development.faq} />
      </SectionFade>

      {/* Figma draws Contact identically to the other two pages', so it reads the same home doc. */}
      <SectionFade>
        <Contact content={contact} />
      </SectionFade>

      {/* Same closing band as the other two, down to the 458px column that sets the break. */}
      <SectionFade>
        <Note content={development.note} className="mx-auto max-w-[458px]" />
      </SectionFade>
    </main>
  )
}
