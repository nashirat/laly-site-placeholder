'use client'

import { type ReactNode, useEffect, useRef, useState } from 'react'

// Scroll gate for a section's entry animations. The hero fires at first paint (it's on screen
// already); everything below the fold hangs off one of these instead, or it would run and finish
// while nobody was looking.
//
// The child animations stay plain CSS with inline `animationDelay` — this only toggles a class
// (see .reveal-gate in styles.css), so the whole stagger stays arithmetic and one observer drives
// the section rather than one per component. Removing the class strips animation-name, which
// rewinds the animations for free, so replay needs no bookkeeping here.
export function InView({ children, className = '' }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) setVisible(true)
      // fully below the viewport again -> rearm. Leaving via the top is deliberately ignored:
      // resetting there would re-run the section behind you on the way up.
      else if (e.boundingClientRect.top > 0) setVisible(false)
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
