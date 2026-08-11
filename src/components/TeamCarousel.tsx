'use client'

import {
  type ReactNode,
  type TouchEvent as ReactTouchEvent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react'
import { MediaImage } from '@/components/Media/Image'
import { Button } from '@/components/ui/Button'
import type { LinkField, TeamMember } from '@/lib/types'
import NavArrowIcon from '../../public/arrow_pixel.svg'

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

  // The preloader hold belongs to the hero marquee alone — these photos are far below the fold, so
  // fetching them behind the curtain would only steal bandwidth from the images the user sees
  // first. Once the curtain is up they warm in the background, well before anyone scrolls here.
  const [warm, setWarm] = useState(false)
  useEffect(() => {
    const root = document.documentElement
    // reduced motion skips the curtain entirely, so it's already done on mount
    if (root.classList.contains('preloader-done')) {
      setWarm(true)
      return
    }
    const observer = new MutationObserver(() => {
      if (!root.classList.contains('preloader-done')) return
      setWarm(true)
      observer.disconnect()
    })
    observer.observe(root, { attributes: true, attributeFilter: ['class'] })
    return () => observer.disconnect()
  }, [])

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
    // md+: the About section's own 32 gap spaces this, so no top margin of its own.
    // px-36 is Figma's Team Section inset (144) — it sits INSIDE the section's own 160, so the card
    // is narrower than the copy above it. Desktop only; mobile keeps the section's 20.
    <div className="section-media-reveal mt-8 text-left md:mt-0 md:px-36">
      {/* mobile only — swipe affordance, sits above the card (no on-card arrows on small screens) */}
      <div className="mb-2 flex items-center justify-end gap-1.5 text-[#FF8A88] md:hidden">
        {/* Fira Code 400 / 10 / 100% / no tracking / #FF8A88 */}
        <span className="font-mono text-[10px] uppercase leading-none">Scroll</span>
        {/* same pixel arrow as the desktop on-card nav, at Figma's 9.14 x 8 */}
        <NavArrowIcon className="w-[9.14px] h-2" />
      </div>

      {/* photo block — fixed height at both sizes: 430 mobile, 450 md+. The old md ratio (112:75)
          grew the card with the viewport; the design pins it, so a wide screen gets a letterbox
          rather than a 900px-tall headshot.
          current photo slides out, incoming slides in from the opposite edge */}
      <div
        className="relative h-[430px] w-full overflow-hidden md:h-[450px]"
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        {/* Keyed by member index, and rendered from an array so React reconciles by key rather than
            by position. Load-bearing, not tidiness.
            When the slide ends, `setCurrent(next)` + `setIncoming(null)` fire together. Unkeyed, the
            children are matched positionally: the OUTGOING div survives and its <Photo> swaps member
            underneath it, so one <img> keeps its DOM node and just gets a new src — while the
            incoming div, already holding the correct fully-decoded image, is unmounted. A browser
            paints the previous frame until the new src decodes, so the carousel visibly snapped back
            to the person you just slid away from. The bigger the source file, the longer it sat
            there.
            Keyed, the node that was `incoming` matches `current` after the swap and is kept intact —
            the decoded image is never rebuilt and nothing re-fetches. */}
        {(incoming === null ? [current] : [current, incoming]).map((idx) => (
          <div
            key={idx}
            className="absolute inset-0"
            style={
              idx === incoming
                ? {
                    transform: phase !== 'idle' ? 'translateX(0)' : `translateX(${photoFrom})`,
                    transition: phase !== 'idle' ? `transform ${PHOTO_MS}ms ${PHOTO_EASE}` : 'none',
                  }
                : {
                    transform: sliding ? `translateX(${photoExit})` : 'translateX(0)',
                    transition: sliding ? `transform ${PHOTO_MS}ms ${PHOTO_EASE}` : 'none',
                  }
            }
          >
            <Photo member={members[idx]} eager={warm} />
          </div>
        ))}

        {/* only current+incoming are mounted, so a neighbour would fetch at slide time and flash its
            blur placeholder. Mounting them hidden warms the cache: display:none doesn't stop an
            <img> fetch, and srcset picks off `sizes`, not layout, so these resolve to the same URL
            the slide asks for later. Just the two adjacent members — warming all 8 fired ~3MB right
            after load for photos most visitors never advance to. */}
        {warm && (
          <div className="hidden" aria-hidden>
            {[(current + 1) % members.length, (current - 1 + members.length) % members.length]
              .filter((i, n, self) => i !== current && i !== incoming && self.indexOf(i) === n)
              .map((i) => (
                <Photo key={members[i].name} member={members[i]} eager />
              ))}
          </div>
        )}

        {/* overlay — same size, 24px padding: masked name top-left, static arrows bottom row */}
        <div className="absolute inset-0 flex flex-col justify-between p-6 3xl:p-8">
          <MaskText
            current={members[current].name}
            incoming={incoming !== null ? members[incoming].name : null}
            phase={phase}
            direction={direction}
            // mobile = body-2/l: New Spirit 400 / 20 / 125% / letter-spacing l / #262626
            className="font-sans text-xl font-normal leading-[1.25] tracking-[-0.01em] text-[#262626] md:text-5xl md:leading-[1.4] md:tracking-normal 3xl:text-6xl"
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
            // mobile = body-2/s: New Spirit 400 / 16 / 125% / letter-spacing l / #FCF7F3
            className="whitespace-pre-line font-sans text-base font-normal leading-[1.25] tracking-[-0.01em] text-[#FCF7F3] md:text-2xl 3xl:text-[28px]"
            {...T_ROLE}
          />
        </div>
        {/* Button/Small/Tertiary — its own Figma spec: 6px padding all round, 1px #FCF7F3 keyline
            on #262626, and a Neue Haas label at 16/125% rather than the mono the others use.
            Instance-only; button styles are deliberately not uniform across the page. */}
        <Button
          variant="outlineInverse"
          href={story.href}
          className="border-[1px]! border-[#FCF7F3]! bg-[#262626]! px-1.5! text-[#FCF7F3]! shadow-[0_1px_2px_0_rgba(16,24,40,0.04)]! [&>span]:font-display! [&>span]:text-base! [&>span]:font-normal! [&>span]:leading-[1.25]!"
        >
          {story.label}
        </Button>
      </div>
    </div>
  )
}

function Photo({ member, eager = false }: { member: TeamMember; eager?: boolean }) {
  return member.photo ? (
    // Two crops, toggled by CSS like the Contact section's pair: the frame is 112:75 landscape at
    // md+ but a 430px-tall column below it, so one file can't serve both.
    //
    // Both <img>s are in the DOM and display:none does NOT cancel a fetch — which is the whole
    // point of the warm-neighbour block above, and a problem here, because this component is
    // mounted four times over (current + incoming + two neighbours). So the hidden crop is given a
    // 1px `sizes`: the browser still fetches, but resolves srcset to the smallest candidate
    // (~16px, a few hundred bytes) instead of a second full-size image. Without it, every viewport
    // would pull four headshots it can never display.
    <>
      <MediaImage
        media={member.photoMobile ?? member.photo}
        eager={eager}
        sizes="(min-width: 1152px) 1px, 100vw"
        className="h-full w-full object-cover object-top md:hidden"
      />
      <MediaImage
        media={member.photo}
        eager={eager}
        // object-cover scales these by width, so the box width is what matters. Between md and 3xl
        // the section is padding-only, so the box tracks the viewport — a fixed px here understated
        // it badly on a 1900px screen. 608 = the section's 160 sides plus this card's own 144.
        // Above 3xl .section-shell caps the shell at 1600, so the box is a constant 1600 - 608.
        sizes="(max-width: 1151px) 1px, (min-width: 1920px) 992px, calc(100vw - 608px)"
        className="hidden h-full w-full object-cover object-top md:block"
      />
    </>
  ) : (
    // ponytail: image placeholder — swap for the real headshot upload
    <div className="flex h-full w-full items-center justify-center bg-[#E8E3DE]">
      <span className="font-mono text-sm uppercase tracking-[0.2em] text-[#867A72]">Photo</span>
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
        className={`h-auto w-10 3xl:w-14 ${direction === 'prev' ? '-scale-x-100' : ''}`}
      />
    </button>
  )
}
