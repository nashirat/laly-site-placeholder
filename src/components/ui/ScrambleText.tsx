'use client'

import { useCallback, useEffect, useRef } from 'react'

// Scramble-decrypt effect, ported from noartmusic.com (slater 61685.js) — vanilla RAF, no GSAP.
// Width-stability relies on a MONOSPACE font (every glyph = same advance width, so swapping chars
// can't jitter, overlap, or change the letter count). ~60% of non-space chars scramble every ~60ms,
// 15% flash a colored span, snap solid past 75% eased progress (power1.out / 0.65s). No leave-revert.
const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#$%&@'
const DURATION = 0.65 // seconds
const TICK = 0.06 // seconds between scramble frames
const THRESHOLD = 0.75 // eased progress at which text snaps solid

// Attach `ref` to the text element; call `run()` from any trigger (the whole button, own hover, …).
export function useScramble<T extends HTMLElement = HTMLSpanElement>(text: string, color = '#ff6d6a') {
  const ref = useRef<T>(null)
  const raf = useRef<number | null>(null)

  useEffect(
    () => () => {
      if (raf.current !== null) cancelAnimationFrame(raf.current)
    },
    [],
  )

  const run = useCallback(() => {
    const el = ref.current
    if (!el) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      el.textContent = text
      return
    }
    if (raf.current !== null) cancelAnimationFrame(raf.current)

    // fixed set of indices — the same chars flicker the whole run
    const indices: number[] = []
    for (let i = 0; i < text.length; i++) {
      if (text[i] !== ' ' && Math.random() < 0.6) indices.push(i)
    }

    let start: number | null = null
    let lastTick = 0
    const step = (now: number) => {
      if (start === null) start = now
      const elapsed = (now - start) / 1000
      const rawT = Math.min(elapsed / DURATION, 1)
      const eased = 1 - (1 - rawT) ** 2 // power1.out

      if (eased < THRESHOLD) {
        if (elapsed - lastTick >= TICK) {
          lastTick = elapsed
          // rebuild from the real text (same length) — swap only chosen indices, so count is fixed
          const c = text.split('')
          for (const i of indices) {
            const rc = CHARS[Math.floor(Math.random() * CHARS.length)]
            c[i] = Math.random() < 0.15 ? `<span style="color:${color}">${rc}</span>` : rc
          }
          el.innerHTML = c.join('')
        }
        raf.current = requestAnimationFrame(step)
      } else {
        el.textContent = text
        raf.current = null
      }
    }
    raf.current = requestAnimationFrame(step)
  }, [text, color])

  return { ref, run }
}

// Plain inline text — triggers on its own hover. Use with a mono font (font-mono) to stay
// width-stable; on a proportional font it will jitter.
export function ScrambleText({
  children,
  color,
  className = '',
}: {
  children: string
  color?: string
  className?: string
}) {
  const { ref, run } = useScramble<HTMLSpanElement>(children, color)
  return (
    <span
      ref={ref}
      onMouseEnter={run}
      className={`inline-block whitespace-nowrap ${className}`.trim()}
    >
      {children}
    </span>
  )
}
