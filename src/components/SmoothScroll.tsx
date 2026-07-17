'use client'

import Lenis from 'lenis'
import { useEffect } from 'react'

// Inertial scrolling. Renders nothing — it only drives Lenis' rAF loop for the page's lifetime.
//
// Lenis animates real scrollTop rather than transforming a wrapper, so everything native keeps
// working: IntersectionObserver still fires, and the <InView> gates need no proxy/sync shim.
//
// Bails entirely under prefers-reduced-motion. Hijacking the scroll wheel is squarely the kind of
// motion that setting is asking us not to do, and there's no "less smooth" version worth shipping —
// not constructing it at all also means no rAF loop and no wheel listeners for those users.
export function SmoothScroll() {
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const lenis = new Lenis()
    let frame = 0
    const raf = (time: number) => {
      lenis.raf(time)
      frame = requestAnimationFrame(raf)
    }
    frame = requestAnimationFrame(raf)

    return () => {
      cancelAnimationFrame(frame)
      lenis.destroy()
    }
  }, [])

  return null
}
