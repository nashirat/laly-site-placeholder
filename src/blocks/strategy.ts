import type { Block } from 'payload'
import { linkField } from './fields'
import { STRATEGY_ACCENTS } from '@/lib/palettes'

// Mirrors StrategyContent + ServicePillar in src/lib/types.ts.
export const StrategyBlock: Block = {
  slug: 'strategy',
  interfaceName: 'StrategyBlock',
  labels: { singular: 'Strategy', plural: 'Strategy' },
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
      admin: { description: 'Press Enter for an authored line break.' },
    },
    {
      name: 'description',
      type: 'textarea',
      required: true,
      admin: { description: 'One paragraph — it wraps to the column on its own.' },
    },
    {
      name: 'cards',
      type: 'array',
      required: true,
      minRows: 1,
      // Three across at md+, so a fourth would drop to a second row the design has no spec for.
      maxRows: 3,
      fields: [
        {
          name: 'title',
          type: 'textarea',
          required: true,
          admin: { description: 'Press Enter for the break — the subject always lands on line 2.' },
        },
        {
          name: 'badges',
          type: 'array',
          required: true,
          minRows: 1,
          maxRows: 3,
          admin: {
            description:
              'Capability pills. The star tint comes from the row position, not from here — all three cards share one accent trio.',
          },
          fields: [{ name: 'label', type: 'text', required: true }],
        },
        {
          name: 'hook',
          type: 'textarea',
          required: true,
          admin: { description: 'One line, the "if you..." sentence. Line breaks render as spaces.' },
        },
        {
          name: 'body',
          type: 'textarea',
          required: true,
          admin: { description: 'The explainer at the foot of the card. Line breaks render as spaces.' },
        },
        linkField(),
        {
          name: 'accent',
          type: 'select',
          required: true,
          defaultValue: 'lilac',
          options: Object.keys(STRATEGY_ACCENTS),
          admin: { description: 'Tints the title and the card’s hover glow.' },
        },
      ],
    },
  ],
}
