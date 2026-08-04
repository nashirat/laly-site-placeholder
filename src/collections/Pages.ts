import type { CollectionConfig } from 'payload'
import { revalidateHome } from '../lib/revalidate'
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
  // Purge the prerendered home html on every save, so /admin edits show up on Vercel immediately
  // instead of whenever the hour-long ISR window happens to lapse. See src/lib/revalidate.ts.
  //
  // skipRevalidation is for bulk writers: scripts/seed-home.ts touches ~40 docs in one run and would
  // otherwise fire ~40 purges of the same single path. It sets the flag and purges once at the end.
  hooks: {
    afterChange: [
      async ({ doc, context }) => {
        if (!context?.skipRevalidation) await revalidateHome()
        return doc
      },
    ],
    afterDelete: [
      async ({ doc, context }) => {
        if (!context?.skipRevalidation) await revalidateHome()
        return doc
      },
    ],
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
