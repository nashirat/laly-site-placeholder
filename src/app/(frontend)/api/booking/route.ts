import { NextResponse } from 'next/server'
import { isFree } from '@/lib/slots'

// Books a slot. The client validates too, but that is a courtesy to the typist — this is the trust
// boundary, so nothing below trusts a single field that arrived in the body.
export const dynamic = 'force-dynamic'

const MAX = 200 // any single field longer than this is not a name, it is a payload

type Body = Record<string, unknown>

const str = (v: unknown): string => (typeof v === 'string' ? v.trim() : '')

export async function POST(request: Request) {
  const body: Body = await request.json().catch(() => ({}))

  const firstName = str(body.firstName)
  const lastName = str(body.lastName)
  const email = str(body.email)
  const zip = str(body.zip)
  const business = str(body.business)
  const start = str(body.start)

  const bad =
    !firstName ||
    !lastName ||
    !business ||
    !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email) ||
    !/^\d{5}(-\d{4})?$/.test(zip) ||
    [firstName, lastName, email, zip, business].some((v) => v.length > MAX)

  if (bad) {
    return NextResponse.json({ error: 'Some of those details did not look right.' }, { status: 400 })
  }

  // The race: two people sit on the same chip, both press confirm. Availability is re-derived here
  // rather than trusted from the picker, so the second one is turned away instead of double-booking.
  if (!isFree(start)) {
    return NextResponse.json(
      { error: 'That time was taken while you were deciding. Pick another.' },
      { status: 409 },
    )
  }

  // ponytail: STUB. Where the real thing goes, in this order:
  //   1. Google Calendar events.insert with conferenceDataVersion=1 and a conferenceData
  //      createRequest -> that response carries the Meet link. (Google Calendar, not the Meet API:
  //      Meet v2 manages spaces and has no availability or scheduling.)
  //   2. persist the lead — a Payload `bookings` collection, deliberately not added yet because it
  //      needs `bun run generate:types` to typecheck and this machine cannot run the build.
  // Until then the booking is logged and no invite is sent, so this must not claim one was.
  console.info('[booking] stub — not yet sent to Google Calendar:', {
    firstName,
    lastName,
    email,
    zip,
    business,
    start,
  })

  // `invited` is load-bearing, not decoration: the success screen words itself off it, so while
  // this is a stub the UI cannot claim an invite was sent. Flip it with the events.insert call.
  return NextResponse.json({ ok: true, meetUrl: null, invited: false })
}
