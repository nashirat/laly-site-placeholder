import About from '@/components/sections/About'
import Contact from '@/components/sections/Contact'
import Hero from '@/components/sections/Hero'
import Note from '@/components/sections/Note'
import Strategy from '@/components/sections/Strategy'
import WhoWeAre from '@/components/sections/WhoWeAre'
import { SectionFade } from '@/components/ui/SectionFade'
import { getHome } from '@/lib/cms'

// Statically prerendered + ISR. The Local API is a direct DB call, so it sits outside Next's fetch
// cache and `revalidate` is the only lever — but that's the right one: the page ships as CDN HTML
// with no DB round-trip on the critical path, which is what Lighthouse measures. On-demand
// revalidation (REVALIDATE_SECRET) replaces the hour-long window later.
export const revalidate = 3600

// All six sections come from Payload now. getHome falls back to the mock per block, so a missing or
// malformed block degrades to placeholder copy rather than failing the build (this page prerenders
// at build time, and free-tier clusters auto-pause when idle) — watch the terminal for [cms] warns,
// a silent fallback is this design's main failure mode.
//
// Every section but the hero is wrapped in <SectionFade>: one opacity ramp per section, tripped by
// its own observer as it comes on screen (tech lead). The hero is above the fold, so it has nothing
// to fade in from. This sits on top of the <InView> reveals inside the sections — the two are
// independent, and a section can hold both.
//
// Section order lives here, not in the CMS: blocks are matched by type, so reordering them in the
// admin does nothing. Next: this becomes [[...slug]]/page.tsx with a real block dispatcher once a
// second page exists, and then the order does come from the doc.
export default async function HomePage() {
  const home = await getHome()

  return (
    <main>
      <Hero content={home.hero} />
      <SectionFade>
        <WhoWeAre content={home.whoWeAre} />
      </SectionFade>
      <SectionFade>
        <Strategy content={home.strategy} />
      </SectionFade>
      <SectionFade>
        <About content={home.about} />
      </SectionFade>
      <SectionFade>
        <Contact content={home.contact} />
      </SectionFade>
      <SectionFade>
        <Note content={home.note} />
      </SectionFade>
    </main>
  )
}
