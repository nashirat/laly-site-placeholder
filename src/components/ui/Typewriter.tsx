'use client'

import { useEffect, useRef, useState } from 'react'

// Typewriter heading — reveals `text` one character at a time with an underscore caret riding the
// leading edge of the typed run, blinking once the line is done.
//
// Own IntersectionObserver rather than the <InView> gate: this needs a JS clock anyway (the reveal
// is per-character, not a CSS transition), and below-fold sections deliberately have no shared
// cascade. Fires once — no rearm on scroll-back, same rule as InView.
//
// Layout note: each line renders an invisible copy of its full text to hold the box open, with the
// typed run overlaid on top. Without it the section below would jump on every character.

const CHAR_MS = 110 // per character; a '\n' eats one tick, which reads as the line-break beat

export function Typewriter({
  text,
  className = '',
  as: Tag = 'h2',
}: {
  text: string
  className?: string
  as?: 'h1' | 'h2' | 'p'
}) {
  const ref = useRef<HTMLElement>(null)
  const [count, setCount] = useState(0)
  const lines = text.split('\n')

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const start = () => {
      if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) {
        setCount(text.length)
        return () => {}
      }
      const id = setInterval(() => {
        setCount((c) => {
          if (c >= text.length) {
            clearInterval(id)
            return c
          }
          return c + 1
        })
      }, CHAR_MS)
      return () => clearInterval(id)
    }

    let stop: (() => void) | undefined
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.intersectionRatio >= 0.25) {
          stop = start()
          io.disconnect() // played once
        }
      },
      { threshold: 0.25 },
    )
    io.observe(el)
    return () => {
      io.disconnect()
      stop?.()
    }
  }, [text])

  let offset = 0
  return (
    <Tag ref={ref as never} className={className} aria-label={text}>
      {lines.map((line) => {
        const start = offset
        offset += line.length + 1 // +1 for the '\n' tick
        const shown = Math.min(Math.max(count - start, 0), line.length)
        // caret only exists while typing — it leaves with the last character, no parked cursor
        const typing = count >= start && count < start + line.length

        return (
          <span key={line} className="relative block" aria-hidden>
            <span className="invisible">{line}</span>
            <span className="absolute inset-0 flex items-start justify-center">
              <span>{line.slice(0, shown)}</span>
              {typing && <span className="tw-caret">_</span>}
            </span>
          </span>
        )
      })}
    </Tag>
  )
}
