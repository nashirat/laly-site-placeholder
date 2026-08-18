'use client'

import { useEffect, useRef, useState } from 'react'

// The "we answer every call" panel graphic (paid.whatYouGet.panels[1]) — the one mock that is live
// DOM rather than a flat export, because the client asked for the pie to wipe in clockwise and the
// total to count up. Everything here is decorative: aria-hidden on the root, and the panel's own
// copy already says what it says.
//
// Geometry is measured off the original 942x517 export and expressed as percentages of the root
// box, so it survives whatever width the slot gives it. Type is sized in cqw for the same reason —
// the widget is 471px in the panel and full-bleed on a phone, and a media-query breakpoint would
// leave it wrong everywhere in between.
//
// ponytail: values are consts, not CMS fields. It replaced an image; an image had no fields either,
// and inventing four collections for a decorative widget is how a mock becomes a product.

const TOTAL = 1062
const GROWTH = '5.2%'

// Slice ends, in degrees clockwise from 12 o'clock, measured off the export. Amber straddles 12, so
// it is written as the two arcs that meet there.
const PIE = `conic-gradient(from 0deg,
  #F4CD96 0deg 115deg,
  #FC9997 115deg 153deg,
  #E8D9E5 153deg 228deg,
  #D0D198 228deg 306deg,
  #F4CD96 306deg 360deg)`

// The legend fades down the list in the original — bottom row is nearly out. Order is the design's,
// not the slice order.
const LEGEND = [
  { label: 'Direct Mail', dot: '#E1CBDE', fade: 1 },
  { label: 'Google Ads', dot: '#D1D49A', fade: 0.8 },
  { label: 'Billboard', dot: '#F9DAAC', fade: 0.58 },
  { label: 'Bus Wrap', dot: '#FDCDCA', fade: 0.4 },
]

const CARD = 'absolute rounded-[1.3cqw] bg-[#FFFCF9] shadow-[0_1px_10px_0_rgba(66,55,48,0.10)]'

export function CallsWidget() {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)
  const [count, setCount] = useState(0)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    // straight to the end state, no ramp — same rule the rest of the page's reveals follow
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setVisible(true)
      setCount(TOTAL)
      return
    }

    const io = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return
        io.disconnect() // played once — never rearm, same as InView
        setVisible(true)

        // rAF rather than a timer: the pie wipe is a CSS transition on the compositor, and stepping
        // the number on the same frame clock is what keeps the two reading as one gesture.
        const start = performance.now()
        const tick = (now: number) => {
          const t = Math.min((now - start) / 1400, 1)
          const eased = 1 - Math.pow(1 - t, 5) // easeOutQuint, as everywhere else on the page
          setCount(Math.round(TOTAL * eased))
          if (t < 1) requestAnimationFrame(tick)
        }
        requestAnimationFrame(tick)
      },
      // the widget is half a screen tall in the panel; without this it trips at the viewport bottom
      // and the wipe is over before it is in frame
      { rootMargin: '0px 0px -20% 0px' },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  return (
    <div
      ref={ref}
      aria-hidden
      className={`calls-widget @container relative aspect-[942/517] w-full ${visible ? 'is-visible' : ''}`}
    >
      {/* Call Attribution card */}
      <div className={`${CARD} left-[1.06%] top-[12.57%] h-[84.72%] w-[62.85%]`} />

      <p className="absolute left-[6.2%] top-[19.5%] font-sans text-[3.6cqw] leading-none text-[#7A706A]">
        Call Attribution
      </p>

      <ul className="absolute left-[5.9%] top-[45.5%] flex flex-col gap-[3.4cqw]">
        {LEGEND.map((row) => (
          <li
            key={row.label}
            className="flex items-center gap-[1.5cqw] font-display text-[1.9cqw] leading-none text-[#867A72]"
            style={{ opacity: row.fade }}
          >
            <span
              className="size-[1.7cqw] shrink-0 rounded-full"
              style={{ backgroundColor: row.dot }}
            />
            {row.label}
          </li>
        ))}
      </ul>

      {/* The pie. Not a circle: the export is 295x269, so it carries a slight squash, and matching it
          is cheaper than arguing with it. The clockwise wipe is a conic mask whose angle is a
          registered custom property — an unregistered one is an untyped string and will not
          interpolate. Same mechanic as the bracket labels. */}
      <div
        className="pie-sweep absolute left-[28.66%] top-[32.68%] h-[52.03%] w-[31.32%] rounded-full"
        style={{ backgroundImage: PIE }}
      />

      {/* Total Calls card — drawn after the pie so it overlaps it, as in the export */}
      <div className={`${CARD} left-[45.01%] top-[1.55%] h-[55.9%] w-[53.82%]`} />

      <p className="absolute left-[48.9%] top-[9.5%] font-sans text-[3.6cqw] leading-none text-[#7A706A]">
        Total Calls
      </p>

      <span className="absolute left-[81.3%] top-[10.3%] flex items-center gap-[0.8cqw] rounded-full bg-[#F3E9F2] px-[1.6cqw] py-[1.1cqw] font-display text-[1.9cqw] leading-none text-[#9A8E97]">
        <svg viewBox="0 0 16 16" className="size-[1.9cqw]" fill="none" stroke="currentColor" strokeWidth="1.6">
          <path d="M9 2h5v5M14 2 7.5 8.5" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M12 10v3.5a.5.5 0 0 1-.5.5h-9a.5.5 0 0 1-.5-.5v-9a.5.5 0 0 1 .5-.5H6" strokeLinecap="round" />
        </svg>
        View More
      </span>

      {/* all three centre on the same axis in the export, so they stack rather than sit at three
          separate offsets — which also keeps the number centred as it grows digits */}
      <div className="absolute left-[71.7%] top-[22%] flex -translate-x-1/2 flex-col items-center gap-[1.4cqw]">
        <p className="font-display text-[1.5cqw] leading-none text-[#A9AE63]">{GROWTH} ↗</p>
        {/* tabular figures: without them the width jumps every frame of the count and the whole
            stack twitches */}
        <p // 400 is the lightest Neue Haas that ships; the export sets this in a lighter cut, so it
            // reads a touch heavier here than in the artwork
            className="font-display text-[8cqw] font-normal leading-none text-[#7A736C] tabular-nums">
          {count.toLocaleString('en-US')}
        </p>
        <p className="font-display text-[1.9cqw] leading-none text-[#A99F97]">Calls</p>
      </div>
    </div>
  )
}
