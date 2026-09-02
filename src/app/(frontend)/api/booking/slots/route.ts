import { NextResponse } from 'next/server'
import { slotsFor } from '@/lib/slots'

// Availability for one day. Public and read-only — it leaks nothing an attacker could not learn by
// opening the booking dialog, so there is no secret here to check.
export const dynamic = 'force-dynamic' // slots expire; a cached response would offer dead times

export function GET(request: Request) {
  const date = new URL(request.url).searchParams.get('date') ?? ''
  return NextResponse.json({ slots: slotsFor(date) })
}
