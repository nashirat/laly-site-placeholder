import type { Block } from 'payload'

// Mirrors HeroContent in src/lib/types.ts exactly. Colours, marquee speed, stagger and animation
// delays stay hardcoded in Hero.tsx / ImageMarquee.tsx — they are design, not content.
export const HeroBlock: Block = {
  slug: 'hero',
  // Pins the generated TS interface name so the adapter can import { HeroBlock } from
  // '@/payload-types' instead of indexing into an anonymous union member.
  interfaceName: 'HeroBlock',
  labels: { singular: 'Hero', plural: 'Heroes' },
  fields: [
    {
      name: 'heading',
      type: 'textarea',
      required: true,
      admin: {
        description:
          'Press Enter for the authored line break. Hero.tsx splits on the newline into hard-broken lines — this must stay a textarea, never richText.',
      },
    },
    {
      name: 'description',
      type: 'textarea',
      required: true,
      admin: { description: 'No line breaks — body copy wraps to the viewport.' },
    },
    {
      name: 'button',
      type: 'group',
      fields: [
        { name: 'label', type: 'text', required: true },
        {
          name: 'href',
          type: 'text',
          admin: { description: 'Leave empty to render an inert button (no destination yet).' },
        },
      ],
    },
    {
      name: 'slides',
      type: 'upload',
      relationTo: 'media',
      hasMany: true,
      required: true,
      minRows: 1,
      admin: {
        description:
          'Marquee strip. Order is left-to-right and drives the fade stagger. Any aspect ratio — slides are fixed-height / auto-width.',
      },
    },
  ],
}
