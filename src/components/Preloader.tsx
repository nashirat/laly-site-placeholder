'use client'

import Image from 'next/image'
import { useEffect } from 'react'
import logo from '../../public/blacklogo.png'
import { PRELOADER_HOLD } from '@/lib/motion'

// Full-screen curtain: covers the page from the very first paint (no entrance animation — it is
// simply already there), holds, then slides up to reveal. Pure CSS on the paint clock, so it can't
// flash the page before hydration the way a mount-gated overlay would.
//
// It also owns the hero's start signal: when the slide-up finishes we stamp `entered` on <html>, and
// the hero copy/strip fade in off that class (styles.css) instead of a hand-tuned delay. This is why
// the component is client — the animationend listener is the whole point.
// Later: the same component doubles as the route-transition curtain (slide down to cover, up to
// reveal) — that direction needs client state, so it stays a separate concern.
export function Preloader() {
  useEffect(() => {
    const root = document.documentElement
    // Reduced motion: the curtain is display:none, so animationend never fires — release the hero now
    // (its own reduced-motion rule drops the fade, so this just makes it visible).
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      root.classList.add('entered')
      return
    }
    // Safety net if animationend is missed (e.g. the tab was backgrounded during load): release a
    // hair past the curtain's own timeline (hold + 1.2s slide). Idempotent with the handler below.
    const t = setTimeout(() => root.classList.add('entered'), (PRELOADER_HOLD + 1.4) * 1000)
    return () => clearTimeout(t)
  }, [])

  return (
    <div
      aria-hidden
      // animationend bubbles from children too; the logo doesn't animate, but guard by name anyway.
      onAnimationEnd={(e) => {
        if (e.animationName.includes('preloader-up')) {
          document.documentElement.classList.add('entered')
        }
      }}
      className="preloader fixed inset-0 z-[100] flex items-center justify-center bg-[#ff6d6a]"
      style={{ animationDelay: `${PRELOADER_HOLD}s` }}
    >
      {/* the first thing painted -> this is the LCP element, so it must not lazy-load */}
      <Image
        src={logo}
        alt="Laly Agency"
        priority
        sizes="120px"
        className="h-7 w-30" /* matches the navbar logo exactly (Header.tsx) */
      />
    </div>
  )
}
