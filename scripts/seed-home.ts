/**
 * Seeds the admin user, every Media doc the home page needs, and the Pages `home` doc with all six
 * blocks. Run: bun run seed   (bun resolves @payload-config via tsconfig paths and auto-loads .env)
 *
 * Copy below is duplicated verbatim from src/lib/mock/home.ts rather than imported: that module
 * static-imports .webp files, which bun cannot resolve outside the Next pipeline — importing it would
 * kill this script at parse time. The duplication is intentional: the mock is still the per-block
 * fallback in src/lib/cms.ts, so keeping the two byte-identical is what makes the CMS swap verifiable
 * by diffing the rendered page.
 *
 * Idempotent — safe to re-run. Not cheap to re-run: it re-uploads ~8 MB of media (half of it the
 * Vajra clip) to Vercel Blob every time. See the delete-then-create note below for why.
 */
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { getPayload } from 'payload'
import config from '@payload-config'

// fileURLToPath, not bun's import.meta.dir — keeps this runnable under both `bun run seed` and the
// `payload run` fallback (which executes on Node).
const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')

// Email is only a login identifier — no email adapter is configured, so Payload never sends mail
// (hence the "No email adapter provided" warn on every run) and there is no password-reset flow.
//
// Password comes from the environment, never a literal: this file is committed, and /admin is
// internet-reachable once deployed. The 'admin' fallback only applies to a machine with no
// ADMIN_PASSWORD set — i.e. a fresh local clone, which is also the only place it's harmless.
const ADMIN_EMAIL = 'admin@admin.com'
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin'

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

// Delete-then-create rather than reuse-if-present. Two reasons: Payload appends a suffix on filename
// collision (Bus-1.webp), so a plain re-run would leave orphaned duplicates; and a reused doc keeps
// whatever url the storage adapter gave it when it was first created, so a doc seeded under disk
// storage would keep a /api/media/file/... url after the switch to Blob and 404 on Vercel. Deleting
// first makes a re-run a true storage migration.
//
// `relPath` is relative to public/. Returns the new doc id.
async function upload(relPath: string, alt: string): Promise<string> {
  const filename = path.basename(relPath)

  const found = await payload.find({
    collection: 'media',
    where: { filename: { equals: filename } },
    limit: 1,
    pagination: false,
  })
  for (const stale of found.docs) {
    await payload.delete({ collection: 'media', id: stale.id })
  }

  const doc = await payload.create({
    collection: 'media',
    data: { alt },
    filePath: path.join(ROOT, 'public', relPath),
  })
  // Dimensions double as the sharp smoke test: nullxnull on an image means sharp isn't reaching
  // Payload, and the adapter will drop that doc rather than emit sizes="NaNpx". Videos are expected
  // to print nullxnull — sharp can't decode them and nothing downstream needs their dimensions.
  console.log(`[seed] uploaded ${filename} -> ${doc.width}x${doc.height}`)
  return String(doc.id)
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

// --- hero -------------------------------------------------------------------------------------
// Order drives the marquee's left-to-right fade stagger.
const slides: string[] = []
for (const [file, alt] of [
  ['Billboard.webp', 'Billboard campaign'],
  ['VJ-Ecommerce.webp', 'Vajra ecommerce site design'],
  ['Business-Cards2.webp', 'Business card design'],
  ['Bus.webp', 'Bus wrap advertising'],
  ['Shirt.webp', 'Branded apparel'],
  ['Flyer.webp', 'Print flyer design'],
  ['VJ_CTA.webp', 'Vajra campaign creative'],
] as const) {
  slides.push(await upload(`carousel/${file}`, alt))
}

// --- who we are -------------------------------------------------------------------------------
const senft = await upload('whoweare/Senft-palceholder.webp', 'Senft Legal billboard')
const vajra = await upload('vajra.png', 'Vajra Jahra retreat waterfall')
const vajraClip = await upload('whoweare/vajra.mp4', 'Vajra Jahra retreat waterfall')

// --- about ------------------------------------------------------------------------------------
// Photos are final; `role` is placeholder copy until the real lines land. The \n is the authored
// two-line break (rendered via whitespace-pre-line).
const PLACEHOLDER_ROLE = 'Role line placeholder —\nsecond line of the blurb.'
const TEAM: [string, string, string][] = [
  ['Cindy.webp', 'Cindy Ripoll', 'The trusty team leader\nand your first point of contact.'],
  ['Adam.webp', 'Adam', PLACEHOLDER_ROLE],
  ['Diya.webp', 'Diya', PLACEHOLDER_ROLE],
  ['Fran.webp', 'Fran', PLACEHOLDER_ROLE],
  ['Harry.webp', 'Harry', PLACEHOLDER_ROLE],
  ['Leo.webp', 'Leo', PLACEHOLDER_ROLE],
  ['Nicole.webp', 'Nicole', PLACEHOLDER_ROLE],
  ['Ramon.webp', 'Ramon', PLACEHOLDER_ROLE],
]
const members: { photo: string; name: string; role: string }[] = []
for (const [file, name, role] of TEAM) {
  // alt is the bare first name in the mock, not the full name — kept as-is.
  members.push({ photo: await upload(`aboutus/${file}`, file.replace('.webp', '')), name, role })
}

// --- contact ----------------------------------------------------------------------------------
const ctaDesktop = await upload('growwithus/Cta-Desktop.webp', 'The Laly team')
const ctaMobile = await upload('growwithus/Cta-Mobile.webp', 'The Laly team')

await payload.create({
  collection: 'pages',
  data: {
    title: 'Home',
    slug: 'home',
    // Order here is cosmetic — src/app/(frontend)/page.tsx matches blocks by type. Seeded in visual
    // order anyway so the admin reads like the page.
    content: [
      {
        blockType: 'hero',
        heading: 'Marketing you can follow.\nGrowth you can feel.',
        // no \n — body copy wraps to the viewport (the heading keeps its authored 2-line break)
        description:
          'Optimize your workflows, build your brand, and scale your business with a tech-forward in-house marketing team.',
        // href omitted throughout: the mock has no destinations yet, so Button renders inert.
        button: { label: "LET'S BEGIN" },
        slides,
      },
      {
        blockType: 'whoWeAre',
        label: 'Who we are',
        heading: 'Do you know where your\nmarketing dollars are going?',
        // blank line = paragraph break, same authored-newline convention as the headings
        description:
          "50% of Businesses Fail After Just 5 Years. The Culprit? Wasted Marketing Dollars.\n\nBut It Doesn't Have to Be That Way. This Could Be Us:",
        cards: [
          {
            title: 'Senft Legal',
            image: senft,
            body: 'Senft Legal is a personal injury law firm founded in South Florida in 1991. After 3 years of working with Laly, Senft Legal has an established revenue stream in four states with an active plan for nationwide growth.',
            stat: { value: '133%', label: 'Lead\nIncrease' },
            link: { label: 'EXPLORE' },
            palette: 'olive',
          },
          {
            title: 'Vajra Jahra',
            image: vajra,
            video: vajraClip,
            body: 'Vajra Jahra is a Costa Rica retreat center built in 2023. Vajra Jahra partnered with Laly in 2025, going from 0 bookings to 9. In 2026, Vajra Jahra has already increased revenue by 150% and is on track to be fully booked out for two full calendar years.',
            stat: { value: '150%', label: 'Revenue\nGrowth' },
            link: { label: 'EXPLORE' },
            palette: 'lilac',
          },
        ],
      },
      {
        blockType: 'strategy',
        label: 'Strategy',
        heading: 'How we help you grow.',
        // no \n — the design's 2-line break is just where it lands at that width; max-w does that job
        description: 'You don’t need to spend more—you need to spend smarter.',
        cards: [
          {
            title: 'The Power of Paid\nAdvertisement',
            badges: [
              { label: 'Social Media Strategy' },
              { label: 'Meta-Optimized Ads' },
              { label: 'Scalable Ads' },
            ],
            hook: "If you're looking for a new stream of high-quality leads, this is for you.",
            body: 'Pay for website traffic that translates to a reliable stream of new clients for your business, every month.',
            link: { label: 'Explore paid advertisement' },
            accent: 'lilac',
          },
          {
            title: 'The Power of\nBranding',
            badges: [
              { label: 'Brand Strategy' },
              { label: 'Brand Book & Guidelines' },
              { label: 'Web Design' },
            ],
            hook: 'If your business depends on referrals, this is for you.',
            body: 'Selling a service gets you one-time clients; selling a brand gets you loyal customers. Build and establish your brand on search engines, social media, and beyond, with a clear, recognizable offering that everyone remembers.',
            link: { label: 'Explore branding' },
            accent: 'amber',
          },
          {
            title: 'The Power of\nTechnology',
            badges: [
              { label: 'Custom Code' },
              { label: 'API Integrations' },
              { label: 'Advanced Forms' },
            ],
            hook: 'If your marketing efforts feel disconnected from your business, this is for you.',
            body: 'We custom-build digital systems to help you track everything from where your budget is going to how your business is growing across all platforms.',
            link: { label: 'Explore technology' },
            accent: 'olive',
          },
        ],
      },
      {
        blockType: 'about',
        label: 'About us',
        heading: 'Your In-House\nMarketing Team.',
        description: 'Meet the friendly faces here to nurture your brand’s growth.',
        members,
        story: { label: 'OUR STORY' },
      },
      {
        blockType: 'contact',
        label: 'Contact',
        // the break is the design; this one is display type, not body copy
        heading: 'GROW\nWITH US.',
        buttons: [{ label: "LET'S BEGIN" }, { label: 'BOOK A CALL' }],
        // no hrefs yet — the real account URLs land with the Globals doc
        socials: [
          { platform: 'instagram' },
          { platform: 'tiktok' },
          { platform: 'youtube' },
          { platform: 'facebook' },
        ],
        photo: ctaDesktop,
        photoMobile: ctaMobile,
      },
      {
        blockType: 'note',
        // the break before the closing line is the design; the rest wraps to the container
        body: 'We’re looking for business owners who are passionate about nurturing their brand growth. As passionate as we are about our work, we can only provide services to a limited number of clients—that’s how we ensure every brand gets the attentive focus it deserves.\nGet in touch to be considered.',
      },
    ],
  },
})

console.log('[seed] created pages/home with 6 blocks')
// mongoose keeps the Atlas socket open; without this the process hangs.
process.exit(0)
