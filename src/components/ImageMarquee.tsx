'use client'

import AutoScroll from 'embla-carousel-auto-scroll'
import useEmblaCarousel from 'embla-carousel-react'
import Image from 'next/image'
import img1 from '../../public/carousel/1.png'
import img2 from '../../public/carousel/2.png'
import img3 from '../../public/carousel/3.png'
import img4 from '../../public/carousel/4.png'
import img5 from '../../public/carousel/5.png'

// Static imports -> next/image gives WebP/AVIF, blur placeholder, and intrinsic dims for free.
const IMAGES = [img1, img2, img3, img4, img5]
const SLIDES = [...IMAGES, ...IMAGES] // duplicated so the loop fills wide viewports seamlessly

const BASE_DELAY = 1 // cascade position (after the button at 0.8)
const STAGGER = 0.05 // per-slide, left->right

// Continuous auto-scrolling image strip (Embla + auto-scroll). Slides fade in (opacity only — no
// transform, so it won't fight Embla's loop transforms), staggered left->right. Fade is pure CSS
// (fires at first paint, from the SSR'd markup) so it stays on the hero's single paint clock; Embla
// just takes over scrolling once it hydrates.
// Pause = press and hold (pointerDown), resume on release: stopOnMouseEnter off so hover does
// nothing, stopOnInteraction off so the plugin re-plays once the drag settles instead of staying dead.
export function ImageMarquee() {
  const [emblaRef] = useEmblaCarousel({ loop: true, dragFree: true, align: 'start' }, [
    AutoScroll({ speed: 0.8, startDelay: 0, stopOnInteraction: false, stopOnMouseEnter: false }),
  ])

  return (
    <div ref={emblaRef} className="cursor-grab overflow-hidden active:cursor-grabbing">
      <div className="flex">
        {SLIDES.map((img, i) => (
          <div
            key={i}
            className="fade-in relative shrink-0 pl-4 3xl:pl-8"
            style={{ animationDelay: `${BASE_DELAY + i * STAGGER}s` }}
          >
            <Image
              src={img}
              alt=""
              placeholder="blur"
              sizes="(max-width: 768px) 240px, (min-width: 1920px) 500px, 350px"
              className="h-[240px] w-auto md:h-[340px] 3xl:h-[476px]"
            />
          </div>
        ))}
      </div>
    </div>
  )
}
