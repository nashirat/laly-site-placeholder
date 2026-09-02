'use client'

import type { ReactNode } from 'react'

// Vertical text mask. The outgoing line translates out of an overflow-hidden box while the incoming
// one translates in from the opposite edge — `next` sends text up, `prev` drops it down, so forward
// and back read as different moves rather than the same crossfade.
//
// Extracted from TeamCarousel, which is still its main caller (the About member name and role line).
// The booking dialog's step heading and eyebrow use it too, which is why it lives here now — one
// implementation, so the two never drift apart.
//
// The phase machine belongs to the CALLER: this component is stateless and just renders whatever
// phase it is handed. Timings are props rather than constants because the two callers run different
// clocks, and within a caller each element runs its own (the carousel staggers name against role).
export type MaskPhase = 'idle' | 'exiting' | 'entering'
export type MaskDir = 'next' | 'prev'

export type MaskTiming = {
  exitMs: number
  exitDelayMs: number
  exitEasing: string
  enterMs: number
  enterEasing: string
  delayMs: number
}

export function MaskText({
  current,
  incoming,
  phase,
  direction,
  className,
  exitMs,
  exitDelayMs,
  exitEasing,
  enterMs,
  enterEasing,
  delayMs,
}: {
  current: ReactNode
  // null = at rest, nothing in flight. Non-null mounts the outgoing layer over the incoming one.
  incoming: ReactNode | null
  phase: MaskPhase
  direction: MaskDir
  className: string
} & MaskTiming) {
  const exitTo = direction === 'next' ? 'translateY(110%)' : 'translateY(-110%)'
  const enterFrom = direction === 'next' ? 'translateY(-110%)' : 'translateY(110%)'
  return (
    <div style={{ overflow: 'hidden', position: 'relative', width: '100%' }}>
      {incoming !== null && (
        <div
          className={className}
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            transform: phase !== 'idle' ? exitTo : 'translateY(0)',
            transition:
              phase === 'exiting' ? `transform ${exitMs}ms ${exitEasing} ${exitDelayMs}ms` : 'none',
          }}
        >
          {current}
        </div>
      )}
      <div
        className={className}
        style={{
          // While something is in flight this layer holds the INCOMING text, parked off-side with no
          // transition until the phase flips to entering — that park is what makes it travel in
          // rather than appear.
          transform:
            incoming !== null
              ? phase === 'entering'
                ? 'translateY(0)'
                : enterFrom
              : 'translateY(0)',
          transition: phase === 'entering' ? `transform ${enterMs}ms ${enterEasing} ${delayMs}ms` : 'none',
        }}
      >
        {incoming !== null ? incoming : current}
      </div>
    </div>
  )
}
