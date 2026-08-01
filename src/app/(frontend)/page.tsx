import About from '@/components/sections/About'
import Contact from '@/components/sections/Contact'
import Hero from '@/components/sections/Hero'
import Note from '@/components/sections/Note'
import Strategy from '@/components/sections/Strategy'
import WhoWeAre from '@/components/sections/WhoWeAre'
import { getHomeHero } from '@/lib/cms'
import { home } from '@/lib/mock/home'

// Statically prerendered + ISR. The Local API is a direct DB call, so it sits outside Next's fetch
// cache and `revalidate` is the only lever — but that's the right one: the page ships as CDN HTML
// with no DB round-trip on the critical path, which is what Lighthouse measures. On-demand
// revalidation (REVALIDATE_SECRET) replaces the hour-long window later.
export const revalidate = 3600

// Hero comes from Payload; the other five sections still read the mock until their blocks exist.
// The mix is intentional, not half-finished work. getHomeHero falls back to home.hero on any
// failure, so an unreachable Atlas degrades to mock HTML rather than failing the build (this page
// prerenders at build time, and free-tier clusters auto-pause when idle).
// Next: this becomes [[...slug]]/page.tsx with a block dispatcher once other pages exist.
export default async function HomePage() {
  const hero = await getHomeHero()

  return (
    <main>
      <Hero content={hero} />
      <WhoWeAre content={home.whoWeAre} />
      <Strategy content={home.strategy} />
      <About content={home.about} />
      <Contact content={home.contact} />
      <Note content={home.note} />
    </main>
  )
}
