import Hero from '@/components/sections/Hero'
import { home } from '@/lib/mock/home'

// Phase 4: this becomes [[...slug]]/page.tsx — fetch the Pages doc via the Payload Local API and
// feed content.blocks through a dispatcher. Section props are already the shape it'll return.
export default function HomePage() {
  return (
    <main>
      <Hero content={home.hero} />
    </main>
  )
}
