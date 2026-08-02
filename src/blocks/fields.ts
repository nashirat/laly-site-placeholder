import type { Field } from 'payload'

// A factory, not a shared constant: Payload sanitizes field configs in place, so reusing one object
// reference across two blocks hands the same object to the sanitizer twice.
//
// Mirrors LinkField in src/lib/types.ts. Every CTA on this page is label + optional href, and an
// empty href is meaningful — Button renders an inert <button> rather than a dead <a>.
export const linkField = (name = 'link'): Field => ({
  name,
  type: 'group',
  fields: [
    { name: 'label', type: 'text', required: true },
    {
      name: 'href',
      type: 'text',
      label: 'URL',
      admin: { description: 'Leave empty to render an inert button (no destination yet).' },
    },
  ],
})
