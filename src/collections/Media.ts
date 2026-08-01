import path from 'path'
import { fileURLToPath } from 'url'
import type { CollectionConfig } from 'payload'

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
  fields: [
    // MediaDoc.alt is a non-optional string and every image routes through MediaImage -> next/image.
    // Required here rather than defaulted to '' so a missing alt is caught at author time.
    { name: 'alt', type: 'text', required: true },
  ],
}
