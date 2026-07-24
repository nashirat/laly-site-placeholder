'use client'

import AutoScroll from 'embla-carousel-auto-scroll'
import useEmblaCarousel from 'embla-carousel-react'
import type { CSSProperties } from 'react'
import { MediaImage } from '@/components/Media/Image'
import type { MediaDoc } from '@/lib/types'

const STAGGER = 0.05 // per-slide, left->right

// Continuous auto-scrolling image strip (Embla + auto-scroll). Slides fade in (opacity only — no
// transform, so it won't fight Embla's loop transforms), staggered left->right. The fade is gated on
// <html class="preloading-done"> (see .entry-fade in styles.css) so it starts when the curtain closes
// of the hero; Embla takes over scrolling once it hydrates.
// Pause = press and hold (pointerDown), resume on release: stopOnMouseEnter off so hover does
// nothing, stopOnInteraction off so the plugin re-plays once the drag settles instead of staying dead.
export function ImageMarquee({ slides }: { slides: MediaDoc[] }) {
  const [emblaRef] = useEmblaCarousel({ loop: true, dragFree: true, align: 'start' }, [
    AutoScroll({ speed: 0.8, startDelay: 0, stopOnInteraction: false, stopOnMouseEnter: false }),
  ])

  // duplicated so the loop fills wide viewports seamlessly
  const rendered = [...slides, ...slides]

  return (
    <div ref={emblaRef} className="cursor-grab overflow-hidden active:cursor-grabbing">
      <div className="flex">
        {rendered.map((media, i) => (
          <div
            key={i}
            className="entry-fade relative shrink-0 pl-4 3xl:pl-8"
            style={{ '--slide-delay': `${i * STAGGER}s` } as CSSProperties}
          >
            <MediaImage
              media={media}
              sizes="(max-width: 1151px) 240px, (min-width: 1920px) 500px, 350px"
              className="h-[240px] w-auto md:h-[340px] 3xl:h-[476px]"
            />
          </div>
        ))}
      </div>
    </div>
  )
}
