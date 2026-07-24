// One-shot: downscale the oversized source images in /public. Sources were up to 1.5MB for photos
// that never render above ~1200px, which made next/image's on-demand optimize pass crawl.
// Run once (`bun shrink-images.mjs`), eyeball the results, then delete this file.
import { readFile, readdir, stat, writeFile } from 'node:fs/promises'
import { join } from 'node:path'
import sharp from 'sharp'

const MAX_WIDTH = 1600 // widest any image renders is the 1200px carousel slot on 3xl
const DIRS = ['public/aboutus', 'public/carousel', 'public/growwithus', 'public/whoweare', 'public']

for (const dir of DIRS) {
  for (const file of await readdir(dir)) {
    if (!/\.(webp|png|jpe?g)$/i.test(file)) continue
    const path = join(dir, file)
    const before = (await stat(path)).size
    if (before < 250_000) continue // already small enough to not be the problem

    // read to a buffer, not sharp(path): on Windows sharp keeps the source handle open and
    // writing back over it is EPERM
    const out = await sharp(await readFile(path))
      .resize({ width: MAX_WIDTH, withoutEnlargement: true })
      .webp({ quality: 80 })
      .toBuffer()
    await writeFile(path, out)

    const after = (await stat(path)).size
    console.log(`${path}  ${(before / 1024) | 0}K -> ${(after / 1024) | 0}K`)
  }
}
