/**
 * Seeds the admin user, the 7 hero Media docs from public/carousel, and the Pages `home` doc.
 * Run: bun run seed   (bun resolves @payload-config via tsconfig paths and auto-loads .env)
 *
 * Values below are duplicated verbatim from src/lib/mock/home.ts rather than imported: that module
 * static-imports .webp files, which bun cannot resolve outside the Next pipeline — importing it would
 * kill this script at parse time. The duplication is intentional and temporary: it exists so the
 * seeded page renders identically to the mock, which is how the Payload swap gets verified by diff.
 * Both go away when the other five blocks land.
 *
 * Idempotent — safe to re-run.
 */
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { getPayload } from 'payload'
import config from '@payload-config'

// fileURLToPath, not bun's import.meta.dir — keeps this runnable under both `bun run seed` and the
// `payload run` fallback (which executes on Node).
const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')

const HEADING = 'Marketing you can follow.\nGrowth you can feel.'
const DESCRIPTION =
  'Optimize your workflows, build your brand, and scale your business with a tech-forward in-house marketing team.'
const BUTTON_LABEL = "LET'S BEGIN"

// Email is only a login identifier — no email adapter is configured, so Payload never sends mail
// (hence the "No email adapter provided" warn on every run) and there is no password-reset flow.
//
// Password comes from the environment, never a literal: this file is committed, and /admin is
// internet-reachable once deployed. The 'admin' fallback only applies to a machine with no
// ADMIN_PASSWORD set — i.e. a fresh local clone, which is also the only place it's harmless.
const ADMIN_EMAIL = 'admin@admin.com'
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin'

// [filename, alt] — order drives the marquee's left-to-right fade stagger.
const SLIDES: [string, string][] = [
  ['Billboard.webp', 'Billboard campaign'],
  ['VJ-Ecommerce.webp', 'Vajra ecommerce site design'],
  ['Business-Cards2.webp', 'Business card design'],
  ['Bus.webp', 'Bus wrap advertising'],
  ['Shirt.webp', 'Branded apparel'],
  ['Flyer.webp', 'Print flyer design'],
  ['VJ_CTA.webp', 'Vajra campaign creative'],
]

const payload = await getPayload({ config })

const users = await payload.find({
  collection: 'users',
  where: { email: { equals: ADMIN_EMAIL } },
  limit: 1,
  pagination: false,
})
if (users.docs.length === 0) {
  await payload.create({
    collection: 'users',
    data: { email: ADMIN_EMAIL, password: ADMIN_PASSWORD },
  })
  console.log(`[seed] created admin user ${ADMIN_EMAIL} / ${ADMIN_PASSWORD}`)
} else {
  // Update, don't skip. A skip meant a re-seed left whatever password the user was first created
  // with, so rotating it required the admin UI. Now `ADMIN_PASSWORD=... bun run seed` is the rotation.
  await payload.update({
    collection: 'users',
    id: users.docs[0].id,
    data: { password: ADMIN_PASSWORD },
  })
  console.log(`[seed] updated password for ${ADMIN_EMAIL}`)
}

// Replace any existing home doc so a re-run doesn't trip the unique slug index.
const existing = await payload.find({
  collection: 'pages',
  where: { slug: { equals: 'home' } },
  limit: 1,
  pagination: false,
})
for (const doc of existing.docs) {
  await payload.delete({ collection: 'pages', id: doc.id })
  console.log(`[seed] deleted existing pages/${doc.slug}`)
}

// Delete-then-create rather than reuse-if-present. Two reasons: Payload appends a suffix on filename
// collision (Bus-1.webp), so a plain re-run would leave orphaned duplicates; and a reused doc keeps
// whatever url the storage adapter gave it when it was first created, so a doc seeded under disk
// storage would keep a /api/media/file/... url after the switch to Blob and 404 on Vercel. Deleting
// first makes a re-run a true storage migration. Costs ~3.2 MB of re-upload per run.
const slideIds: string[] = []
for (const [filename, alt] of SLIDES) {
  const found = await payload.find({
    collection: 'media',
    where: { filename: { equals: filename } },
    limit: 1,
    pagination: false,
  })

  for (const stale of found.docs) {
    await payload.delete({ collection: 'media', id: stale.id })
    console.log(`[seed] deleted stale media ${filename}`)
  }

  const doc = await payload.create({
    collection: 'media',
    data: { alt },
    filePath: path.join(ROOT, 'public', 'carousel', filename),
  })
  // width/height printed as the sharp smoke test — nulls here mean ImageMarquee will emit NaN sizes.
  console.log(`[seed] uploaded ${filename} -> ${doc.width}x${doc.height}`)
  slideIds.push(String(doc.id))
}

await payload.create({
  collection: 'pages',
  data: {
    title: 'Home',
    slug: 'home',
    content: [
      {
        blockType: 'hero',
        heading: HEADING,
        description: DESCRIPTION,
        // href omitted: the mock has no destination yet, so Button renders an inert <button>.
        button: { label: BUTTON_LABEL },
        slides: slideIds,
      },
    ],
  },
})

console.log('[seed] created pages/home with 1 hero block')
// mongoose keeps the Atlas socket open; without this the process hangs.
process.exit(0)
