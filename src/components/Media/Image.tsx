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
}: {
  media: MediaDoc
  className?: string
  sizes?: string
  priority?: boolean // set on the LCP image only
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
      priority={priority}
      loading={eager && !priority ? 'eager' : undefined}
      placeholder={media.blurDataURL ? 'blur' : 'empty'}
      blurDataURL={media.blurDataURL}
    />
  )
}
