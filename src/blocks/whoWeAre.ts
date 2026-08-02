import type { Block } from 'payload'
import { linkField } from './fields'
import { CARD_PALETTES } from '@/lib/palettes'

// Mirrors WhoWeAreContent + CaseStudy in src/lib/types.ts.
export const WhoWeAreBlock: Block = {
  slug: 'whoWeAre',
  interfaceName: 'WhoWeAreBlock',
  labels: { singular: 'Who We Are', plural: 'Who We Are' },
  fields: [
    {
      name: 'label',
      type: 'text',
      required: true,
      admin: {
        description:
          'Bare text, e.g. "Who we are". The [ brackets ] and the uppercasing are CSS — do not type them.',
      },
    },
    {
      name: 'heading',
      type: 'textarea',
      required: true,
      admin: { description: 'Press Enter for the authored line break.' },
    },
    {
      name: 'description',
      type: 'textarea',
      required: true,
      admin: {
        description:
          'Leave a BLANK line between paragraphs — that is the paragraph break. A single newline does nothing, and a trailing one is trimmed.',
      },
    },
    {
      name: 'cards',
      type: 'array',
      required: true,
      minRows: 1,
      admin: { description: 'Case studies, stacked in this order.' },
      fields: [
        { name: 'title', type: 'text', required: true },
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          required: true,
          admin: { description: 'Also the poster frame when a video is set.' },
        },
        {
          name: 'video',
          type: 'upload',
          relationTo: 'media',
          admin: {
            description:
              'Optional looping clip (mp4/webm) that replaces the still. Autoplays muted and downloads in full on mobile — keep it short and small.',
          },
        },
        { name: 'body', type: 'textarea', required: true },
        {
          name: 'stat',
          type: 'group',
          fields: [
            {
              name: 'value',
              type: 'text',
              required: true,
              admin: { description: 'e.g. "133%". The number counts up on scroll-in.' },
            },
            {
              name: 'label',
              type: 'textarea',
              required: true,
              admin: { description: 'Press Enter for the two-line break (desktop only).' },
            },
          ],
        },
        linkField(),
        {
          name: 'palette',
          type: 'select',
          required: true,
          defaultValue: 'olive',
          options: Object.keys(CARD_PALETTES),
          admin: {
            description:
              'Card ground, keyline and ink together. The hexes live in src/lib/palettes.ts.',
          },
        },
      ],
    },
  ],
}
