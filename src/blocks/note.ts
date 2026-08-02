import type { Block } from 'payload'

// Mirrors NoteContent in src/lib/types.ts. One paragraph, dark band under Contact.
export const NoteBlock: Block = {
  slug: 'note',
  interfaceName: 'NoteBlock',
  labels: { singular: 'Note', plural: 'Notes' },
  fields: [
    {
      name: 'body',
      type: 'textarea',
      required: true,
      admin: {
        description:
          'Rendered with whitespace-pre-line, so every Enter you press is a real line break. The design puts the closing sentence on its own row.',
      },
    },
  ],
}
