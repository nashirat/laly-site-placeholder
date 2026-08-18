import type { Block } from 'payload'
import { linkField } from './fields'

// The six /paid-advertising blocks. One file, unlike the home blocks: those are each edited on their
// own and one is reused by two pages, these six exist only as this page's stack and are read as one
// screen. Mirrors the Paid* types in src/lib/types.ts.
//
// The dark closing band is NOT here — /paid-advertising reuses the home page's `note` block (same
// one paragraph, different copy), so its doc just carries a second note row.

// Every section opens with the same bracketed eyebrow. Bare text in the CMS: the brackets are
// authored in the page's JSX, exactly like the home sections put them in CSS.
const labelField: Block['fields'][number] = {
  name: 'label',
  type: 'text',
  required: true,
  admin: { description: 'Bare text. The [ brackets ] and uppercasing are added by the page.' },
}

export const PaidHeroBlock: Block = {
  slug: 'paidHero',
  interfaceName: 'PaidHeroBlock',
  labels: { singular: 'Paid Hero', plural: 'Paid Heroes' },
  fields: [
    { ...labelField, admin: { description: 'Bare text, e.g. "Pay Per Performance".' } },
    {
      name: 'heading',
      type: 'textarea',
      required: true,
      admin: { description: 'One line at desktop; on a phone it breaks itself at the text width.' },
    },
    {
      name: 'pills',
      type: 'array',
      required: true,
      minRows: 1,
      maxRows: 4,
      admin: {
        description:
          'Ad platforms. The star colour comes from the row position, not from here — four rows fill the design’s trio-plus-one.',
      },
      fields: [{ name: 'label', type: 'text', required: true }],
    },
    {
      name: 'description',
      type: 'group',
      admin: {
        description:
          'One sentence set in three parts: the middle one is the bold Neue Haas run the designer put mid-sentence. Mind the spaces and the full stop at the joins.',
      },
      fields: [
        { name: 'before', type: 'textarea', required: true },
        {
          name: 'emphasis',
          type: 'text',
          required: true,
          admin: { description: 'Rendered bold and a size down, e.g. "You pay per qualified lead".' },
        },
        {
          name: 'after',
          type: 'textarea',
          required: true,
          admin: { description: 'Starts with the punctuation that closes the emphasised phrase.' },
        },
      ],
    },
    linkField('button'),
  ],
}

export const GuaranteeBlock: Block = {
  slug: 'guarantee',
  interfaceName: 'GuaranteeBlock',
  labels: { singular: 'Guarantee Band', plural: 'Guarantee Bands' },
  fields: [
    {
      name: 'body',
      type: 'textarea',
      required: true,
      admin: { description: 'Press Enter for the authored break — the designer set two lines.' },
    },
    {
      name: 'scratchLabel',
      type: 'text',
      required: true,
      defaultValue: 'Scratch To Reveal',
      admin: {
        description:
          'Printed on the panel covering the copy above. Never seen under reduced motion, where the cover is not drawn at all.',
      },
    },
  ],
}

export const WhatYouGetBlock: Block = {
  slug: 'whatYouGet',
  interfaceName: 'WhatYouGetBlock',
  labels: { singular: 'What You Get', plural: 'What You Get' },
  fields: [
    labelField,
    {
      name: 'heading',
      type: 'textarea',
      required: true,
      admin: { description: 'Wraps to the column on its own — no authored break.' },
    },
    {
      name: 'panels',
      type: 'array',
      required: true,
      // The 1 / 2 / 1 grid is drawn by hand and each slot has its own width, so the count is fixed.
      minRows: 4,
      maxRows: 4,
      admin: {
        description:
          'Exactly four, in layout order: wide, then the two side by side, then wide again. Row 1 and row 4 put their mock beside the copy; rows 2 and 3 put it underneath.',
      },
      fields: [
        {
          name: 'title',
          type: 'textarea',
          required: true,
          admin: {
            description:
              'Every Enter you press is a real line break. Leave it as one line and it wraps on its own.',
          },
        },
        { name: 'body', type: 'textarea', required: true },
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          required: true,
          admin: {
            description:
              'Flat export of the product mock (2x webp). Not a live widget — replacing this file is how the artwork changes.',
          },
        },
      ],
    },
  ],
}

export const ResultsBlock: Block = {
  slug: 'results',
  interfaceName: 'ResultsBlock',
  labels: { singular: 'Results', plural: 'Results' },
  fields: [
    labelField,
    { name: 'heading', type: 'textarea', required: true },
    {
      name: 'stats',
      type: 'array',
      required: true,
      minRows: 1,
      // Three across at md+, so a fourth would drop to a row the design has no spec for.
      maxRows: 3,
      admin: { description: 'Cards, left to right. They fade in in this order.' },
      fields: [
        {
          name: 'value',
          type: 'text',
          required: true,
          admin: { description: 'The big number, e.g. "31" or "$0". Free text — not counted up.' },
        },
        {
          name: 'label',
          type: 'textarea',
          required: true,
          admin: {
            description: 'Press Enter for the desktop break. On a phone the same copy wraps instead.',
          },
        },
      ],
    },
  ],
}

export const PricingBlock: Block = {
  slug: 'pricing',
  interfaceName: 'PricingBlock',
  labels: { singular: 'Pricing', plural: 'Pricing' },
  fields: [
    labelField,
    {
      name: 'heading',
      type: 'textarea',
      required: true,
      admin: { description: 'Press Enter for the authored break after the second sentence.' },
    },
    {
      name: 'tiers',
      type: 'array',
      required: true,
      minRows: 1,
      // Two columns at md+; the cards stretch to match, which only works pairwise.
      maxRows: 2,
      fields: [
        {
          name: 'label',
          type: 'text',
          required: true,
          admin: { description: 'e.g. "One-time Setup".' },
        },
        { name: 'price', type: 'text', required: true },
        {
          name: 'badge',
          type: 'text',
          admin: {
            description:
              'The tab straddling the card’s top edge. Filling this in also gives the card the brand keyline and glow — leave it empty for the plain card.',
          },
        },
        {
          name: 'items',
          type: 'array',
          required: true,
          minRows: 1,
          admin: { description: 'Bulleted list.' },
          fields: [{ name: 'label', type: 'textarea', required: true }],
        },
      ],
    },
    // One button, rendered at the foot of every card — the design repeats the same CTA.
    linkField('cta'),
  ],
}

export const FaqBlock: Block = {
  slug: 'faq',
  interfaceName: 'FaqBlock',
  labels: { singular: 'FAQ', plural: 'FAQs' },
  fields: [
    labelField,
    { name: 'heading', type: 'textarea', required: true },
    {
      name: 'items',
      type: 'array',
      required: true,
      minRows: 1,
      admin: { description: 'Rows, top to bottom. Each opens on click and slides shut again.' },
      fields: [
        { name: 'question', type: 'text', required: true },
        { name: 'answer', type: 'textarea', required: true },
      ],
    },
  ],
}
