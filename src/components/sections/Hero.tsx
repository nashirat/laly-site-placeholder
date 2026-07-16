import { ImageMarquee } from '@/components/ImageMarquee'
import { Button } from '@/components/ui/Button'
import { LineReveal } from '@/components/ui/LineReveal'
import { TextReveal } from '@/components/ui/TextReveal'

// Home hero — first section. Cream full-viewport. Height stays content-driven (min-h).
// Heading = Figma display/l: Neue Haas (font-display) 500 / 72px / 100% leading / center / #262626.
// Desc = Figma body-2/xxl: New Spirit (font-sans) 400 / 28px / 125% leading / center / #4A4A4A.
// Entry: everything is pure CSS (fires at first paint) so the whole cascade shares ONE clock and
// stays aligned — heading @0/0.2, desc @0.4/0.6, button @0.8, carousel @1.0. No hydration offset.
export default function Hero() {
  return (
    <section aria-label="Home" className="min-h-[100dvh] w-full bg-[#fffcf9]">
      <div className="mx-auto max-w-[1056px] px-5 pt-40 text-center">
        <TextReveal
          as="h1"
          lines={['Marketing you can follow.', 'Growth you can feel.']}
          lineDelay={0.2}
          className="font-display text-7xl font-medium leading-none tracking-tight text-[#262626]"
        />
        <LineReveal
          lines={[
            'Optimize your workflows, build your brand, and scale your',
            'business with a tech-forward in-house marketing team.',
          ]}
          delay={0.4} /* accumulates after the heading's 2 lines (0, 0.2) */
          stagger={0.2} /* one 0.2 beat per line -> desc lines @0.4, 0.6 */
          className="mx-auto mt-6 max-w-[616px] font-sans text-[28px] font-normal leading-[1.25] text-[#4A4A4A]"
        />
        {/* button fades up last — pure CSS (fade-up), same paint clock as the rest. after desc + 0.2 */}
        <div className="fade-up mt-6 flex justify-center" style={{ animationDelay: '0.8s' }}>
          <Button variant="primary">LET&apos;S BEGIN</Button>
        </div>
      </div>

      {/* full-bleed image strip, 96px below the button; already scrolling, slides fade in staggered */}
      <div className="mt-24 w-full">
        <ImageMarquee />
      </div>
    </section>
  )
}
