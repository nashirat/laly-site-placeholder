import { MediaImage } from '@/components/Media/Image'
import { InView } from '@/components/ui/InView'
import type { MediaDoc } from '@/lib/types'

// The "full refund" panel graphic (paid.whatYouGet.panels[3]). The client asked for the circular
// arrow to reveal around the dollar sign, so the ring draws itself the way it was drawn: from the
// tail at ten o'clock, anticlockwise all the way round to the arrowhead. The dollar sign never
// moves — it is the thing being circled.
//
// The export is untouched underneath. Over it sits a patch of the card's own ground, masked to the
// ring's band and then to the part of the turn the sweep has not reached yet, so what retracts is
// the cover and what arrives is the real artwork. The band is the mask, not a punch in the image:
// punching took the card's ground away with the arrow and left the panel showing through, which
// read as a white bite out of the card.
//
// The cover is a gradient, not a colour: the card's ground is not flat, it lifts from 249,243,241 at
// the top of the export to 255,252,249 by about 60% down and holds there, and it does not vary with
// x at all (sampled at both edges of the band). A flat fill was a visible pale bite out of the card
// wherever the ground was darker than it.
//
// Geometry is measured off the 1031x511 export: ring centre 637,346, band 160 to 300 out from it —
// wide enough for the arrowhead, which overshoots the stroke on both sides. Radii are cqw so they
// track the mock's width: 515px in the panel, full-bleed on a phone.
const CENTRE = '61.78% 67.71%'
const BAND = `radial-gradient(circle at ${CENTRE}, transparent 0 15.52cqw, #000 15.52cqw 29.1cqw, transparent 29.1cqw)`
// The arrowhead is not on the stroke's band: it is a chevron, and its inner tip reaches 90 out from
// the centre where the band starts at 160. That tip was the bit of arrow left showing before the
// sweep had started, which is what the client flagged. It gets its own cover, 88 to 162 out and only
// across the head's own sector — the dollar sign reaches 138 elsewhere but only 81 straight up, so
// this takes the head's tip without touching it. Sector measured off the export: 342 to 12 degrees,
// widened by 4 either side.
const HEAD_SECTOR = `conic-gradient(from 338deg at ${CENTRE}, #000 0deg 38deg, transparent 38deg)`
const HEAD_BAND = `radial-gradient(circle at ${CENTRE}, transparent 0 8.53cqw, #000 8.53cqw 15.71cqw, transparent 15.71cqw)`
// export rows 0, 100, 160 and 310 of 511, sampled clear of the artwork
const GROUND = 'linear-gradient(#F9F3F1 0%, #FCF5F3 20%, #FCF8F5 31%, #FFFCF9 61%)'

export function RefundMock({ media, width }: { media: MediaDoc; width: number }) {
  return (
    <InView className="mock-gate @container relative w-full" rootMargin="0px 0px -25% 0px">
      <MediaImage
        media={media}
        sizes={`(min-width: 1152px) ${width}px, 100vw`}
        // block, not the inline default: an inline image leaves a descender gap in the wrapper the
        // percentages are measured against
        className="block h-auto w-full"
      />

      {/* The cone that closes — outermost now, so everything under it retreats on the same clock.
          --arrow-sweep is registered in styles.css so it can be transitioned. */}
      <div aria-hidden className="arrow-sweep absolute inset-0">
        {/* the stroke's band: nothing outside the ring is ever touched */}
        <div className="absolute inset-0" style={{ maskImage: BAND, background: GROUND }} />

        {/* and the arrowhead's tip, inside it. Two masks, so two elements — nesting intersects them
            without mask-composite, same as everywhere else on this page. */}
        <div className="absolute inset-0" style={{ maskImage: HEAD_SECTOR }}>
          <div className="absolute inset-0" style={{ maskImage: HEAD_BAND, background: GROUND }} />
        </div>
      </div>
    </InView>
  )
}
