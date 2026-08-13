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
      admin: {
        description:
          'Two lines under the heading — press Enter after "nurture" for the break. At 24px the whole sentence fits one row, so it will not wrap on its own.',
      },
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
            description:
              'Landscape crop, shown at md and up. Optional — the carousel renders an empty frame while a headshot is missing.',
          },
        },
        {
          name: 'photoMobile',
          type: 'upload',
          relationTo: 'media',
          admin: {
            description:
              'Portrait crop, shown below md. The frame flips from 112:75 landscape to a 430px-tall column, so one file cannot serve both. Optional — falls back to the landscape crop, which centre-crops hard on a phone.',
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
