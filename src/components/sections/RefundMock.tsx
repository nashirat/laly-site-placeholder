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
const BAND = 'circle at 61.78% 67.71%, transparent 0 15.52cqw, #000 15.52cqw 29.1cqw, transparent 29.1cqw'
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

      {/* the band the cover is allowed to paint in — nothing outside the ring is ever touched */}
      <div
        aria-hidden
        className="absolute inset-0"
        style={{ maskImage: `radial-gradient(${BAND})` }}
      >
        {/* the cone that closes; --arrow-sweep is registered in styles.css so it can be transitioned */}
        <div className="arrow-sweep absolute inset-0" style={{ background: GROUND }} />
      </div>
    </InView>
  )
}
