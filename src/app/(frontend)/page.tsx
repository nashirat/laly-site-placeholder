import About from '@/components/sections/About'
import Contact from '@/components/sections/Contact'
import Hero from '@/components/sections/Hero'
import Note from '@/components/sections/Note'
import Strategy from '@/components/sections/Strategy'
import WhoWeAre from '@/components/sections/WhoWeAre'
import { home } from '@/lib/mock/home'

// Phase 4: this becomes [[...slug]]/page.tsx — fetch the Pages doc via the Payload Local API and
// feed content.blocks through a dispatcher. Section props are already the shape it'll return.
export default function HomePage() {
  return (
    <main>
      <Hero content={home.hero} />
      <WhoWeAre content={home.whoWeAre} />
      <Strategy content={home.strategy} />
      <About content={home.about} />
      <Contact content={home.contact} />
      <Note content={home.note} />
    </main>
  )
}
