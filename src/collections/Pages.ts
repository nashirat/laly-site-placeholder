import type { CollectionConfig } from 'payload'
import { HeroBlock } from '../blocks/hero'

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
      // Only the hero is modelled in this phase. The other five sections still read
      // src/lib/mock/home.ts; each gets registered here as it's migrated.
      blocks: [HeroBlock],
    },
  ],
}
