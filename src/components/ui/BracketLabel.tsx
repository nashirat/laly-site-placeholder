'use client'

import { useEffect, useRef, useState, type CSSProperties } from 'react'

// Section eyebrow: "[ WHO WE ARE ]". Brackets swing out from the centre while the label wipes up.
// The motion itself is pure CSS (styles.css, .bracket-label) — all this does is flip is-visible when
// the label scrolls in, so it works in a section that has no <InView> gate of its own. Inside one it
// still animates off the gate, so home keeps the section's clock and nothing double-fires.
//
// Fires ONCE: disconnect on the first intersection, no rearm. Same rule as InView — replaying the
// reveal on every scroll-back read as tacky (team review).
//
// karocrafts' arrangement: the brackets spread to the row's edges rather than hugging the text, so
// the label reads wide and airy. Width is a plain Tailwind class on the caller (w-44 md:w-80 ...) —
// the bracket travel derives from the element's own width via container queries, so it tracks
// whatever the breakpoint says, and a long label just needs a bigger number. Centring is the
// caller's too (mx-auto): the compound-effect eyebrow is the one that sits left in its column.
//
// Color is the caller's: it flips per section (warm grey on cream, brand pink on dark).
export function BracketLabel({
  children,
  className = '',
  style,
}: {
  children: string
  className?: string
  style?: CSSProperties
}) {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return
      setVisible(true)
      io.disconnect() // played once — never rearm
    })
    io.observe(el)
    return () => io.disconnect()
  }, [])

  return (
    <div
      ref={ref}
      aria-label={children}
      style={style}
      // mobile 14px (caption spec), desktop 24px (Figma heading/h5/l). tracking is letter-spacing/xxxl
      // — token value unknown, eyeballed off the 1120 frame; nudge here, not per caller.
      //
      // The desktop size goes through a var rather than a plain class so a caller can override it:
      // h5/l is not one number across the file — the compound-effect frame sets its eyebrow at 18 —
      // and two arbitrary md:text-[…] classes on one element collide on source order, not on which
      // one the caller passed last.
      className={`bracket-label ${visible ? 'is-visible' : ''} flex justify-between font-mono text-[14px] font-normal uppercase leading-[1.4] tracking-[0.2em] md:text-[length:var(--bracket-size,24px)] ${className}`}
    >
      <p aria-hidden>{children}</p>
    </div>
  )
}
