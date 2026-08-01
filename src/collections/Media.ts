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
    mimeTypes: ['image/*'],
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
          // Never block an upload over a placeholder. sharp can't rasterize svg without librsvg,
          // and mimeTypes lets image/svg+xml through.
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
