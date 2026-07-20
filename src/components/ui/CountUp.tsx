'use client'

import { type CSSProperties, useEffect, useRef, useState } from 'react'

// Count-up for a stat like "133%": ticks 000% -> 133% once, when the element scrolls into view,
// 0.2s after the card lands. Leading-zero padded to the target's digit width so it reads "000%"
// (not "0%") and never reflows. Own IntersectionObserver, fires once (disconnect on first hit).
// SSR / no-JS render the final value; reduced-motion holds it too.
const DURATION = 1800
const DELAY = 200
// easeOutExpo — very strong deceleration, so the count crawls the last few % into the target
const easeOutExpo = (t: number) => (t >= 1 ? 1 : 1 - 2 ** (-10 * t))

export function CountUp({
  value,
  className = '',
  style,
}: {
  value: string
  className?: string
  style?: CSSProperties
}) {
  const ref = useRef<HTMLSpanElement>(null)
  const parts = value.match(/^(\d+)(.*)$/)
  const target = parts ? Number.parseInt(parts[1], 10) : 0
  const suffix = parts ? parts[2] : value
  const width = parts ? parts[1].length : 0

  const [n, setN] = useState(target) // final value on the server / before hydration

  useEffect(() => {
    const el = ref.current
    if (!el || !parts) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    setN(0) // hold at zero until it scrolls in
    let raf = 0
    let timer = 0
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return
      io.disconnect()
      timer = window.setTimeout(() => {
        let startTs = 0
        const step = (ts: number) => {
          if (!startTs) startTs = ts
          const p = Math.min((ts - startTs) / DURATION, 1)
          setN(Math.round(easeOutExpo(p) * target))
          if (p < 1) raf = requestAnimationFrame(step)
        }
        raf = requestAnimationFrame(step)
      }, DELAY)
    })
    io.observe(el)
    return () => {
      io.disconnect()
      cancelAnimationFrame(raf)
      clearTimeout(timer)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value])

  const text = parts ? String(n).padStart(width, '0') + suffix : value
  return (
    <span ref={ref} className={`tabular-nums ${className}`.trim()} style={style}>
      {text}
    </span>
  )
}
