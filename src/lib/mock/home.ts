import type { StaticImageData } from 'next/image'
import img1 from '../../../public/carousel/1.png'
import img2 from '../../../public/carousel/2.png'
import img3 from '../../../public/carousel/3.png'
import img4 from '../../../public/carousel/4.png'
import img5 from '../../../public/carousel/5.png'
import type { HeroContent, MediaDoc } from '@/lib/types'

// Stand-in for the Pages "home" doc until Payload exists (Phase 4 deletes this file).
// Static imports already carry dims + a generated blurDataURL, i.e. the same fields a Media doc
// has — so we adapt them to MediaDoc here and the components never learn where images came from.
const toMedia = (img: StaticImageData, alt: string): MediaDoc => ({
  url: img.src,
  width: img.width,
  height: img.height,
  blurDataURL: img.blurDataURL,
  alt,
})

export const home: { hero: HeroContent } = {
  hero: {
    heading: 'Marketing you can follow.\nGrowth you can feel.',
    // no \n — body copy wraps to the viewport (the heading keeps its authored 2-line break)
    description:
      'Optimize your workflows, build your brand, and scale your business with a tech-forward in-house marketing team.',
    button: { label: "LET'S BEGIN" },
    slides: [
      toMedia(img1, 'Senft Legal billboard campaign'),
      toMedia(img2, 'Mobile commerce app screens'),
      toMedia(img3, 'Brand stationery mockup'),
      toMedia(img4, 'Editorial landing page design'),
      toMedia(img5, 'Product photography art direction'),
    ],
  },
}
