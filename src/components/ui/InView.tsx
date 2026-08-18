'use client'

import { type ReactNode, useEffect, useRef, useState } from 'react'

// Scroll gate for below-fold sections. The wrapper observer releases bracket/text. Media gets its
// own observer so card/photo placeholders can wait until 4% of the media block is visible.
//
// Fires ONCE: disconnect on the first intersection, no rearm. Replaying the reveal every time you
// scroll back past a section read as tacky (team review), so once it's played it's done.
export function InView({
  children,
  className = '',
  // Shrinks the observer's root, so the gate trips once the element is properly on screen rather
  // than the instant its top edge touches the viewport bottom. Tall blocks need it: a card grid is
  // most of a screen high, so without it the reveal is over before you have scrolled to look at it.
  rootMargin,
}: {
  children: ReactNode
  className?: string
  rootMargin?: string
}) {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)
  const [mediaVisible, setMediaVisible] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setVisible(true)
          io.disconnect() // played once — never rearm
        }
      },
      { rootMargin },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [rootMargin])

  useEffect(() => {
    const el = ref.current?.querySelector('.section-media-reveal')
    if (!el) return

    const io = new IntersectionObserver(
      ([e]) => {
        if (e.intersectionRatio >= 0.04) {
          setMediaVisible(true)
          io.disconnect()
        }
      },
      { threshold: 0.04 },
    )

    io.observe(el)
    return () => io.disconnect()
  }, [])

  return (
    <div
      ref={ref}
      className={`reveal-gate ${visible ? 'is-visible' : ''} ${
        mediaVisible ? 'is-media-visible' : ''
      } ${className}`.trim()}
    >
      {children}
    </div>
  )
}
