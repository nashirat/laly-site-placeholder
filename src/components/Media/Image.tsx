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
}: {
  media: MediaDoc
  className?: string
  sizes?: string
  priority?: boolean // set on the LCP image only
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
      placeholder={media.blurDataURL ? 'blur' : 'empty'}
      blurDataURL={media.blurDataURL}
    />
  )
}
