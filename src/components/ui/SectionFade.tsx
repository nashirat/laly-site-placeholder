'use client'

import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react'

// One whole-section opacity ramp, wrapped around a section on the page rather than built into it:
// every section on a page gets the same reveal without eight components each growing their own
// observer, and the server components among them stay server components (this wrapper is the only
// client boundary the reveal needs).
//
// Deliberately independent of <InView> and the .reveal-gate classes. Those animate things INSIDE a
// section — brackets, copy, cards — and keep doing so; this fades the section as a single object
// above them. A section can hold both.
//
// Fires ONCE and disconnects. Replaying a reveal on the way back up reads as tacky (same call
// <InView> makes).
export function SectionFade({
  children,
  // ms. Named per-section only where a section wants a different clock; the default is the number
  // the branding page was signed off with.
  duration = 700,
  // Shrinks the observer's root so the ramp trips once the section is properly on screen rather
  // than the instant its top edge touches the viewport bottom — the sections here are all around a
  // window tall, so without it the fade is over before you have scrolled to look at it.
  rootMargin = '-10% 0px',
}: {
  children: ReactNode
  duration?: number
  rootMargin?: string
}) {
  const ref = useRef<HTMLDivElement>(null)
  const [shown, setShown] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    // Reduced motion: on from the first effect, and styles.css drops the transition, so it never
    // animates at all.
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setShown(true)
      return
    }

    const io = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return
        setShown(true)
        io.disconnect()
      },
      { rootMargin },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [rootMargin])

  return (
    <div
      ref={ref}
      className={`section-fade ${shown ? 'is-visible' : ''}`}
      style={{ '--fade-ms': `${duration}ms` } as CSSProperties}
    >
      {children}
    </div>
  )
}
