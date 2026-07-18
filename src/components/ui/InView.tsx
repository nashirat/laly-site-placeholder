'use client'

import { type ReactNode, useEffect, useRef, useState } from 'react'

// Scroll gate for a below-fold section's bracket label. The hero fires at first paint (it's on
// screen already); the sections hang off one of these so the bracket wipe doesn't run and finish
// while nobody's looking. It only toggles the .reveal-gate class (see styles.css); the bracket's
// clip/translate transition rides off that.
//
// Fires ONCE: disconnect on the first intersection, no rearm. Replaying the reveal every time you
// scroll back past a section read as tacky (team review), so once it's played it's done.
export function InView({ children, className = '' }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) {
        setVisible(true)
        io.disconnect() // played once — never rearm
      }
    })
    io.observe(el)
    return () => io.disconnect()
  }, [])

  return (
    <div ref={ref} className={`reveal-gate ${visible ? 'is-visible' : ''} ${className}`.trim()}>
      {children}
    </div>
  )
}
