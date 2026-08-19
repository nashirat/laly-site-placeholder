import { MediaImage } from '@/components/Media/Image'
import { InView } from '@/components/ui/InView'
import type { MediaDoc } from '@/lib/types'

// The "real-time dashboard" panel graphic (paid.whatYouGet.panels[2]). Still the flat export — the
// client asked for the call-volume line to draw itself left to right, and that is a wipe, not a
// rebuild: a patch the colour of the chart's own ground sits over the line and retracts to the
// right, so the line comes in from the left edge.
//
// It works because the chart ground is flat across x and only drifts down y (#FCF6F1 at the top of
// the plot to #FEF9F6 at the bottom, sampled off the export), so the patch is a two-stop gradient
// and is invisible against what it covers. The faint gridlines are within two levels of the ground
// and come back with the line; nobody sees them arrive.
//
// Geometry is percentages of the 1020x528 export, same as WebsiteMock and CallsWidget. The patch
// stops short of the axis rule on the left and the export's own edge fade on the right.
//
// ponytail: a wipe over the export, not an SVG traced off it. A traced path would need the line
// painted out of the asset first, and this reads the same on a 458px mock.
export function DashboardMock({ media, width }: { media: MediaDoc; width: number }) {
  return (
    <InView className="mock-gate relative w-full" rootMargin="0px 0px -25% 0px">
      <MediaImage
        media={media}
        sizes={`(min-width: 1152px) ${width}px, 100vw`}
        // block, not the inline default: an inline image leaves a descender gap in the wrapper the
        // percentages below are measured against
        className="block h-auto w-full"
      />

      {/* export px 178,288 / 728x204 — the line's box, inside the plot area */}
      <div
        aria-hidden
        className="chart-wipe absolute left-[19.43%] top-[54.55%] h-[38.64%] w-[79.48%] bg-gradient-to-b from-[#FCF6F1] to-[#FEF9F6]"
      />
    </InView>
  )
}
