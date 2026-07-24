import NextImage from 'next/image'
import type { MediaDoc } from '@/lib/types'

// The one deliberate abstraction: every image goes through here taking a Media-shaped prop, so
// swapping mock static-imports for Payload URLs touches this file and nothing else.
// ponytail: a wrapper, not an image library. Add props when a caller actually needs them.
export function MediaImage({
  media,
  className = '',
  sizes,
  priority = false,
  eager = false,
  quality = 100,
  unoptimized = false,
}: {
  media: MediaDoc
  className?: string
  sizes?: string
  priority?: boolean // set on the LCP image only
  // next/image re-encodes to AVIF/WebP and defaults to q=75 — that default, not the source file,
  // is what ships. 100 = max; drop it per-caller if a specific image's weight ever matters.
  quality?: number
  // serve the source file as-is: no resize, no AVIF re-encode, no srcset. For fixed-height /
  // w-auto layouts where one `sizes` string can't fit slides of differing aspect ratios, so the
  // widest slide ends up under-served. Costs the full file on every viewport — mobile included.
  unoptimized?: boolean
  // opt out of lazy-loading without claiming LCP priority: the fetch starts at parse time (i.e.
  // behind the preloader curtain) instead of when the image scrolls into view, so galleries the
  // user reaches mid-scroll are already decoded and never show their blur placeholder.
  eager?: boolean
}) {
  return (
    <NextImage
      src={media.url}
      alt={media.alt}
      width={media.width}
      height={media.height}
      className={className}
      sizes={sizes}
      quality={quality}
      unoptimized={unoptimized}
      priority={priority}
      loading={eager && !priority ? 'eager' : undefined}
      placeholder={media.blurDataURL ? 'blur' : 'empty'}
      blurDataURL={media.blurDataURL}
    />
  )
}
