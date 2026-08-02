import type { Block } from 'payload'

// Mirrors ContactContent + SocialLink in src/lib/types.ts.
export const ContactBlock: Block = {
  slug: 'contact',
  interfaceName: 'ContactBlock',
  labels: { singular: 'Contact', plural: 'Contact' },
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
      admin: {
        description:
          'Display type, typed out on scroll-in. Press Enter for each authored line — this one is set at 200px, so the breaks are the design.',
      },
    },
    {
      name: 'buttons',
      type: 'array',
      required: true,
      // Contact.tsx reads buttons[0] and buttons[1] by index and styles them differently; a third
      // row would silently never render.
      minRows: 2,
      maxRows: 2,
      admin: { description: 'Exactly two: the first renders filled, the second outlined.' },
      fields: [
        { name: 'label', type: 'text', required: true },
        {
          name: 'href',
          type: 'text',
          label: 'URL',
          admin: { description: 'Leave empty to render an inert button.' },
        },
      ],
    },
    {
      name: 'socials',
      type: 'array',
      admin: { description: 'Icon row. The platform picks the icon — there is no custom-icon path.' },
      fields: [
        {
          name: 'platform',
          type: 'select',
          required: true,
          // Not free text: each value maps to an entry in the Icon registry.
          options: ['instagram', 'tiktok', 'youtube', 'facebook'],
        },
        {
          name: 'href',
          type: 'text',
          label: 'URL',
          admin: { description: 'The account URL. Empty links to # until the real one exists.' },
        },
      ],
    },
    {
      name: 'photo',
      type: 'upload',
      relationTo: 'media',
      required: true,
      admin: { description: 'Portrait crop, shown at md and up.' },
    },
    {
      name: 'photoMobile',
      type: 'upload',
      relationTo: 'media',
      required: true,
      admin: {
        description: 'Landscape crop, shown below md. The frame’s aspect flips, so one file cannot serve both.',
      },
    },
  ],
}
