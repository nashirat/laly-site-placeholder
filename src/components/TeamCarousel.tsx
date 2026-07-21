'use client'

import { type ReactNode, type TouchEvent as ReactTouchEvent, useCallback, useRef, useState } from 'react'
import { MediaImage } from '@/components/Media/Image'
import { Button } from '@/components/ui/Button'
import type { LinkField, TeamMember } from '@/lib/types'
import NavArrowIcon from '../../public/nav_arrow.svg'

// About team carousel — one member per slide, state-driven (no Embla) so the photo and the text move
// independently: on arrow click the PHOTO slides horizontally (right on next, left on prev) while the
// NAME and the role line mask vertically up/down. Arrows + Our Story stay put.
// The mask/slide model is lifted from the reference project's RightPanel: an outgoing layer translates
// out of an overflow-hidden box as an incoming layer translates in from the opposite edge, driven by an
// idle -> exiting -> entering phase machine. Payload later: `members` shape is unchanged.

type Phase = 'idle' | 'exiting' | 'entering'
type Dir = 'next' | 'prev'

// per-element mask timings (exit up/in, then enter from the opposite edge)
const T_NAME = {
  exitMs: 350, exitDelayMs: 0, exitEasing: 'cubic-bezier(0.76,0,0.9,0.4)',
  enterMs: 350, enterEasing: 'cubic-bezier(0.1,0.8,0.3,1)', delayMs: 0,
}
const T_ROLE = {
  exitMs: 310, exitDelayMs: 0, exitEasing: 'cubic-bezier(0.55,0,1,0.45)',
  enterMs: 310, enterEasing: 'cubic-bezier(0.25,1,0.5,1)', delayMs: 0,
}
const PHOTO_MS = 700
const PHOTO_EASE = 'cubic-bezier(0.4,0,0.5,1)'

const ALL = [T_NAME, T_ROLE]
const MAX_EXIT_MS = Math.max(...ALL.map((t) => t.exitDelayMs + t.exitMs))
const UNLOCK_MS =
  Math.max(PHOTO_MS, ...ALL.map((t) => t.exitDelayMs + t.exitMs + t.delayMs + t.enterMs)) + 30

export function TeamCarousel({ members, story }: { members: TeamMember[]; story: LinkField }) {
  const [current, setCurrent] = useState(0)
  const [incoming, setIncoming] = useState<number | null>(null)
  const [phase, setPhase] = useState<Phase>('idle')
  const [direction, setDirection] = useState<Dir>('next')
  const locked = useRef(false)

  const advance = useCallback(
    (dir: Dir) => {
      const len = members.length
      if (locked.current || len < 2) return
      const next = dir === 'next' ? (current + 1) % len : (current - 1 + len) % len

      // reduced motion: swap instantly, no mask/slide
      if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) {
        setCurrent(next)
        return
      }

      locked.current = true
      setDirection(dir)
      setIncoming(next)
      // mount the incoming layer at its off-screen start, THEN (double rAF) flip phase so the
      // transition actually animates from that start rather than snapping.
      requestAnimationFrame(() =>
        requestAnimationFrame(() => {
          setPhase('exiting')
          setTimeout(() => setPhase('entering'), MAX_EXIT_MS)
          setTimeout(() => {
            setCurrent(next)
            setIncoming(null)
            setPhase('idle')
            locked.current = false
          }, UNLOCK_MS)
        }),
      )
    },
    [current, members.length],
  )

  // touch swipe (mobile has no arrows): left => next, right => prev
  const touchX = useRef<number | null>(null)
  const onTouchStart = (e: ReactTouchEvent) => {
    touchX.current = e.touches[0].clientX
  }
  const onTouchEnd = (e: ReactTouchEvent) => {
    if (touchX.current === null) return
    const dx = e.changedTouches[0].clientX - touchX.current
    touchX.current = null
    if (Math.abs(dx) < 40) return
    advance(dx < 0 ? 'next' : 'prev')
  }

  const photoExit = direction === 'next' ? '-100%' : '100%'
  const photoFrom = direction === 'next' ? '100%' : '-100%'
  const sliding = incoming !== null && phase !== 'idle'

  return (
    <div className="section-media-reveal mt-8 text-left md:mt-10 3xl:mt-12">
      {/* mobile only — swipe affordance, sits above the card (no on-card arrows on small screens) */}
      <div className="mb-2 flex items-center justify-end gap-1.5 text-[#ff6d6a] md:hidden">
        <span className="font-mono text-xs uppercase tracking-wider">Scroll</span>
        <NavArrowIcon className="h-4 w-4" />
      </div>

      {/* photo block — mobile: fixed 430px tall, width fills; md+: 1120:750 ratio.
          current photo slides out, incoming slides in from the opposite edge */}
      <div
        className="relative h-[430px] w-full overflow-hidden md:h-auto md:aspect-[112/75]"
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        <div
          className="absolute inset-0"
          style={{
            transform: sliding ? `translateX(${photoExit})` : 'translateX(0)',
            transition: sliding ? `transform ${PHOTO_MS}ms ${PHOTO_EASE}` : 'none',
          }}
        >
          <Photo member={members[current]} />
        </div>
        {incoming !== null && (
          <div
            className="absolute inset-0"
            style={{
              transform: phase !== 'idle' ? 'translateX(0)' : `translateX(${photoFrom})`,
              transition: phase !== 'idle' ? `transform ${PHOTO_MS}ms ${PHOTO_EASE}` : 'none',
            }}
          >
            <Photo member={members[incoming]} />
          </div>
        )}

        {/* overlay — same size, 24px padding: masked name top-left, static arrows bottom row */}
        <div className="absolute inset-0 flex flex-col justify-between p-6 3xl:p-8">
          <MaskText
            current={members[current].name}
            incoming={incoming !== null ? members[incoming].name : null}
            phase={phase}
            direction={direction}
            className="font-sans text-[32px] font-normal leading-[1.4] text-[#262626] md:text-5xl 3xl:text-6xl"
            {...T_NAME}
          />
          {/* on-card arrows — desktop only; mobile uses swipe + the SCROLL affordance above */}
          <div className="hidden items-end justify-between md:flex">
            <NavArrow direction="prev" onClick={() => advance('prev')} />
            <NavArrow direction="next" onClick={() => advance('next')} />
          </div>
        </div>
      </div>

      {/* info bar — dark ground: masked role line left, static Our Story button right */}
      <div className="flex items-center justify-between gap-4 bg-[#292624] px-6 py-5 3xl:gap-6 3xl:px-8 3xl:py-6">
        <div className="min-w-0 flex-1">
          <MaskText
            current={members[current].role}
            incoming={incoming !== null ? members[incoming].role : null}
            phase={phase}
            direction={direction}
            className="whitespace-pre-line font-sans text-lg font-normal leading-[1.25] text-[#FCF7F3] md:text-2xl 3xl:text-[28px]"
            {...T_ROLE}
          />
        </div>
        <Button variant="outlineInverse" href={story.href}>
          {story.label}
        </Button>
      </div>
    </div>
  )
}

function Photo({ member }: { member: TeamMember }) {
  return member.photo ? (
    <MediaImage
      media={member.photo}
      sizes="(max-width: 768px) 100vw, (min-width: 1920px) 1200px, 1056px"
      className="h-full w-full object-cover"
    />
  ) : (
    // ponytail: image placeholder — swap for the real headshot upload
    <div className="flex h-full w-full items-center justify-center bg-[#E8E3DE]">
      <span className="font-mono text-xs uppercase tracking-wider text-[#867A72]">Photo</span>
    </div>
  )
}

// Vertical text mask: outgoing (current) translates out of an overflow-hidden box while the incoming
// layer translates in from the opposite edge. `direction` next => text rises; prev => text drops.
function MaskText({
  current, incoming, phase, direction, className,
  exitMs, exitDelayMs, exitEasing, enterMs, enterEasing, delayMs,
}: {
  current: ReactNode
  incoming: ReactNode | null
  phase: Phase
  direction: Dir
  className: string
  exitMs: number
  exitDelayMs: number
  exitEasing: string
  enterMs: number
  enterEasing: string
  delayMs: number
}) {
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
            transition: phase === 'exiting' ? `transform ${exitMs}ms ${exitEasing} ${exitDelayMs}ms` : 'none',
          }}
        >
          {current}
        </div>
      )}
      <div
        className={className}
        style={{
          transform: incoming !== null ? (phase === 'entering' ? 'translateY(0)' : enterFrom) : 'translateY(0)',
          transition: phase === 'entering' ? `transform ${enterMs}ms ${enterEasing} ${delayMs}ms` : 'none',
        }}
      >
        {incoming !== null ? incoming : current}
      </div>
    </div>
  )
}

function NavArrow({ direction, onClick }: { direction: Dir; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={direction === 'prev' ? 'Previous member' : 'Next member'}
      className="inline-flex cursor-pointer items-center justify-center"
    >
      <NavArrowIcon
        className={`h-10 w-10 3xl:h-14 3xl:w-14 ${direction === 'prev' ? '-scale-x-100' : ''}`}
      />
    </button>
  )
}
