// Availability, server side. Both booking routes read it: /api/booking/slots to draw the chips, and
// /api/booking to re-check that the chosen one is still free before it writes anything. Sharing one
// generator is the point — two copies of "business hours" drift, and the drift shows up as a booking
// confirmed against a slot the picker never offered.
//
// ponytail: this is the STUB. It fabricates a plausible week instead of asking Google. Swapping in
// the real thing means replacing busySlots() with a freebusy.query call and leaving everything else
// alone — the shapes here are already the shapes Calendar returns.

// Agency-local business hours. Env so staging can widen them without a deploy.
const TZ = process.env.BOOKING_TZ || 'America/New_York'
const OPEN_HOUR = Number(process.env.BOOKING_OPEN_HOUR ?? 9)
const CLOSE_HOUR = Number(process.env.BOOKING_CLOSE_HOUR ?? 17)
const LUNCH_HOUR = 12
export const SLOT_MINUTES = 30

export type Slot = { start: string; end: string }

// How far `tz` is from UTC at a given instant, in ms. Intl is the only thing in the platform that
// knows the IANA rules, so this reads the wall clock it would print and diffs it against the instant.
function offsetAt(at: Date, tz: string): number {
  const parts = Object.fromEntries(
    new Intl.DateTimeFormat('en-US', {
      timeZone: tz,
      hour12: false,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    })
      .formatToParts(at)
      .map((p) => [p.type, p.value]),
  ) as Record<string, string>
  const asUTC = Date.UTC(
    Number(parts.year),
    Number(parts.month) - 1,
    Number(parts.day),
    Number(parts.hour) % 24,
    Number(parts.minute),
    Number(parts.second),
  )
  return asUTC - at.getTime()
}

// A wall-clock time in TZ -> the UTC instant it names.
// ponytail: single correction pass, so the hour that a DST jump deletes resolves to its neighbour
// rather than erroring. Business hours are 9–17 and no zone shifts inside that window, so it cannot
// bite here; iterate twice if slots ever move to 02:00.
function toUtc(date: string, hour: number, minute: number): Date {
  const naive = new Date(
    `${date}T${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}:00Z`,
  )
  return new Date(naive.getTime() - offsetAt(naive, TZ))
}

// No busy list. Every offered day returns the identical grid.
//
// This replaced a per-day pseudo-random one, and the reason is a UI reason, not a data one: a
// different number of chips per date meant the block changed height on every date click, so the
// picker jumped under the cursor. Constant hours means the layout is fixed and the client can keep
// the previous day's chips on screen while the next day loads.
//
// When Google goes in, freebusy.query replaces this and the counts start varying for real — at
// which point the chip area needs a min-height reserved for the busiest day, or the shift comes
// straight back.

/** Free 30-minute slots on `date` (YYYY-MM-DD), as UTC ISO strings. Past slots are dropped. */
export function slotsFor(date: string): Slot[] {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) return []

  const all: Slot[] = []
  for (let h = OPEN_HOUR; h < CLOSE_HOUR; h++) {
    if (h === LUNCH_HOUR) continue
    for (let m = 0; m < 60; m += SLOT_MINUTES) {
      const start = toUtc(date, h, m)
      all.push({
        start: start.toISOString(),
        end: new Date(start.getTime() + SLOT_MINUTES * 60_000).toISOString(),
      })
    }
  }

  // An hour of lead time. Offering a call that starts in four minutes is how you book a no-show.
  // The picker only offers days from tomorrow on, so this trims nothing today — it is the guard for
  // a hand-crafted request hitting the API directly, which is exactly where isFree() is called from.
  const floor = Date.now() + 60 * 60_000
  return all.filter((s) => new Date(s.start).getTime() > floor)
}

/** Whether a specific ISO instant is still bookable. The race guard on POST. */
export function isFree(startIso: string): boolean {
  const at = new Date(startIso)
  if (Number.isNaN(at.getTime())) return false
  // Derive the day in TZ rather than from the ISO string's UTC date — near midnight those differ,
  // and asking the wrong day would call every late slot free.
  const day = new Intl.DateTimeFormat('en-CA', { timeZone: TZ }).format(at)
  return slotsFor(day).some((s) => s.start === startIso)
}
