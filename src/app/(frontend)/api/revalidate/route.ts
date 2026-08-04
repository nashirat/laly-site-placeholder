import { revalidatePath } from 'next/cache'
import { type NextRequest, NextResponse } from 'next/server'

// Purge target for the Payload collection hooks — see src/lib/revalidate.ts for why they POST here
// instead of calling revalidatePath() inline.
//
// Secret falls back to PAYLOAD_SECRET so this works on Vercel with no new env var. It is checked
// because the route is internet-reachable and revalidatePath is a cache-eviction primitive: left
// open, anyone could force a rebuild of the page on every request and turn the CDN into a passthrough
// to Atlas. Compared as plain strings — a timing attack here buys an attacker cache eviction, not
// data, and PAYLOAD_SECRET is high-entropy.
export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null)
  const expected = process.env.REVALIDATE_SECRET || process.env.PAYLOAD_SECRET

  if (!expected || body?.secret !== expected) {
    return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 })
  }

  const paths: string[] = Array.isArray(body?.paths) ? body.paths.map(String) : []
  if (paths.length === 0) {
    return NextResponse.json({ ok: false, error: 'No paths provided' }, { status: 400 })
  }

  for (const path of paths) revalidatePath(path)
  return NextResponse.json({ ok: true, revalidated: paths })
}
