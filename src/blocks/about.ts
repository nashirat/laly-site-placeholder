import type { Block } from 'payload'
import { linkField } from './fields'

// Mirrors AboutContent + TeamMember in src/lib/types.ts.
export const AboutBlock: Block = {
  slug: 'about',
  interfaceName: 'AboutBlock',
  labels: { singular: 'About Us', plural: 'About Us' },
  fields: [
    {
      name: 'label',
      type: 'text',
      required: true,
      admin: { description: 'Bare text. The [ brackets ] and uppercasing are CSS.' },
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
      admin: { description: 'One line under the heading. No breaks — it wraps.' },
    },
    {
      name: 'members',
      type: 'array',
      required: true,
      minRows: 1,
      admin: { description: 'Carousel order, left to right.' },
      fields: [
        {
          name: 'photo',
          type: 'upload',
          relationTo: 'media',
          admin: {
            description: 'Optional — the carousel renders an empty frame while a headshot is missing.',
          },
        },
        { name: 'name', type: 'text', required: true },
        {
          name: 'role',
          type: 'textarea',
          required: true,
          admin: { description: 'The info-bar line. Press Enter for the authored two-line break.' },
        },
      ],
    },
    linkField('story'),
  ],
}
