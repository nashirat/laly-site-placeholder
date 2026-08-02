import type { CollectionConfig } from 'payload'
import { AboutBlock } from '../blocks/about'
import { ContactBlock } from '../blocks/contact'
import { HeroBlock } from '../blocks/hero'
import { NoteBlock } from '../blocks/note'
import { StrategyBlock } from '../blocks/strategy'
import { WhoWeAreBlock } from '../blocks/whoWeAre'

export const Pages: CollectionConfig = {
  slug: 'pages',
  access: { read: () => true },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'slug', 'updatedAt'],
  },
  // No versions/drafts at this stage: they'd add _status, create _pages_versions, switch the admin
  // to Save-Draft/Publish (so a seeded doc could sit unpublished and invisible), and need draft
  // handling in getHomeHero — none of it testable without a preview route. Adding them later is
  // additive with no data migration; existing docs count as published.
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      admin: { description: 'Admin-panel label only. Not rendered.' },
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      index: true,
      admin: { description: "The home page is 'home'." },
    },
    {
      name: 'content',
      type: 'blocks',
      required: true,
      minRows: 1,
      admin: {
        description:
          'The home page renders these by type, not by the order below — its section order is fixed in code, so dragging rows here changes nothing on the site. Deleting a row does: that section falls back to its placeholder copy.',
      },
      blocks: [HeroBlock, WhoWeAreBlock, StrategyBlock, AboutBlock, ContactBlock, NoteBlock],
    },
  ],
}
