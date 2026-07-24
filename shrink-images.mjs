// One-shot: downscale the oversized source images in /public. Sources were up to 1.5MB for photos
// that never render above ~1200px, which made next/image's on-demand optimize pass crawl.
// Run once (`bun shrink-images.mjs`), eyeball the results, then delete this file.
import { readFile, readdir, stat, writeFile } from 'node:fs/promises'
import { join } from 'node:path'
import sharp from 'sharp'

// Per-directory cap. Default 1600 is plenty: nothing renders wider than the 1200px team-carousel
// slot at 3xl. aboutus gets 3200 — those are the full-bleed member portraits, the one place a
// retina screen can actually resolve the extra pixels. (2400 already covers 1200px @2x; the rest is
// headroom the client asked for.)
const DEFAULT_MAX_WIDTH = 1600
const DIRS = {
  'public/aboutus': { maxWidth: 3200, quality: 85 },
  'public/carousel': {},
  'public/growwithus': {},
  'public/whoweare': {},
  public: {},
}

for (const [dir, opts] of Object.entries(DIRS)) {
  const maxWidth = opts.maxWidth ?? DEFAULT_MAX_WIDTH
  const quality = opts.quality ?? 80

  for (const file of await readdir(dir)) {
    if (!/\.(webp|png|jpe?g)$/i.test(file)) continue
    const path = join(dir, file)
    const before = (await stat(path)).size
    if (before < 250_000) continue // already small enough to not be the problem

    // read to a buffer, not sharp(path): on Windows sharp keeps the source handle open and
    // writing back over it is EPERM
    const out = await sharp(await readFile(path))
      .resize({ width: maxWidth, withoutEnlargement: true })
      .webp({ quality })
      .toBuffer()
    await writeFile(path, out)

    const after = (await stat(path)).size
    console.log(`${path}  ${(before / 1024) | 0}K -> ${(after / 1024) | 0}K`)
  }
}
