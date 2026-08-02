import path from 'path'
import { fileURLToPath } from 'url'
import type { CollectionConfig } from 'payload'
import sharp from 'sharp'

const dirname = path.dirname(fileURLToPath(import.meta.url))

export const Media: CollectionConfig = {
  slug: 'media',
  // Public read so the frontend / REST path isn't blocked. Writes stay admin-only by default.
  access: { read: () => true },
  admin: { useAsTitle: 'filename' },
  upload: {
    // dirname is <root>/src/collections -> <root>/public/media
    staticDir: path.resolve(dirname, '../../public/media'),
    // Video too — the Who We Are cards take an optional looping clip, and sia-cms's pattern is the
    // right one: a clip is just another Media doc served from its own url, not a second collection
    // and not a pasted URL string. Explicit codecs rather than 'video/*' so nobody uploads a 200 MB
    // .mov that no browser can play.
    mimeTypes: ['image/*', 'video/mp4', 'video/webm'],
    // No imageSizes / formatOptions on purpose: next/image is the resizer and re-encoder and works
    // off the original. Payload-generated derivatives would be dead bytes on disk that never enter
    // a srcset.
  },
  hooks: {
    beforeChange: [
      // Blur-up placeholder. Static imports get a blurDataURL free from StaticImageData, so the mock
      // had one and Payload docs didn't — MediaImage silently degraded to placeholder="empty" and
      // slides popped in from blank. This restores parity.
      //
      // sharp is already a dependency (Payload needs it for width/height), so no plaiceholder or
      // blurhash package. 16px wide is what next/image wants: it upscales and CSS-blurs the thing,
      // so detail past ~20px is wasted bytes inlined into the HTML on every request.
      async ({ data, req }) => {
        const buf = req.file?.data
        if (!buf) return data // metadata-only update (alt edit) — keep the existing blur
        try {
          const blur = await sharp(buf).resize(16).webp({ quality: 20 }).toBuffer()
          return { ...data, blurDataURL: `data:image/webp;base64,${blur.toString('base64')}` }
        } catch {
          // Never block an upload over a placeholder. Videos land here every time (sharp can't
          // decode mp4), and so does svg — sharp needs librsvg to rasterize it, and mimeTypes lets
          // image/svg+xml through.
          return data
        }
      },
    ],
  },
  fields: [
    // MediaDoc.alt is a non-optional string and every image routes through MediaImage -> next/image.
    // Required here rather than defaulted to '' so a missing alt is caught at author time.
    { name: 'alt', type: 'text', required: true },
    // Written by the hook above, never by hand.
    { name: 'blurDataURL', type: 'text', admin: { hidden: true } },
  ],
}
