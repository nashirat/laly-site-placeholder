'use client'

import { useRouter } from 'next/navigation'
import { useCallback, useEffect, useState, useTransition } from 'react'
import { Curtain } from '@/components/Preloader'
import { PRELOADER_CLOSE_DURATION } from '@/lib/motion'

// Route transitions reuse the preloader curtain: it slides up from below to cover, holds while the
// destination finishes loading, then keeps going up to reveal it. Same pink, same logo, same 1.2s
// easeInOutQuint in both directions — the whole point is that a navigation reads as the same gesture
// the page opened with.
//
// This intercepts clicks at the document instead of shipping a <TransitionLink>: every internal
// link on the site is a plain next/link (nav, footer, the Strategy cards' ArrowCircleButton), and a
// wrapper would mean touching all of them and remembering to use it for the next one.
//
// Navigation starts on click, not after the cover finishes, so the fetch overlaps the 1.2s slide and
// a warm route reveals with no dead hold at all.
const DURATION_MS = PRELOADER_CLOSE_DURATION * 1000
// animationend is primary; this only covers a backgrounded tab dropping the event. A stuck curtain
// is a dead site, so both directions get one.
const FALLBACK_MS = DURATION_MS + 200

type Phase = 'idle' | 'cover' | 'hold' | 'reveal'

const PHASE_CLASS: Record<Exclude<Phase, 'idle'>, string> = {
  cover: 'is-cover',
  hold: 'is-hold',
  reveal: 'is-reveal',
}

export function RouteTransition() {
  const router = useRouter()
  const [phase, setPhase] = useState<Phase>('idle')
  // isPending stays true until the destination's RSC payload has arrived and committed — i.e. it IS
  // the "target page loaded" signal, no manual load tracking needed.
  const [isPending, startTransition] = useTransition()

  const reveal = useCallback(() => {
    // The destination mounted behind the curtain, so its entry cascade already played to nobody.
    // Re-adding the gate class restarts every .entry-copy animation from zero, and it does so at the
    // moment the reveal starts — the same offset the cascade has on a cold load, where the class
    // flips as the curtain begins to lift.
    const root = document.documentElement
    root.classList.remove('preloader-done')
    void root.offsetWidth // forced reflow, or the remove/add collapses into no change
    root.classList.add('preloader-done')
    // Next resets scroll on push, but Lenis owns scrollTop here and can land mid-page. Behind the
    // curtain, so it is never seen.
    window.scrollTo(0, 0)
    setPhase('reveal')
  }, [])

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      // let the browser have modified clicks (new tab / download / middle button) and anything a
      // handler upstream already claimed
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) {
        return
      }
      const anchor = (e.target as Element | null)?.closest?.('a')
      const href = anchor?.getAttribute('href')
      if (!anchor || !href || anchor.target === '_blank' || anchor.hasAttribute('download')) return

      // reduced motion gets a plain next/link navigation — same bail the preloader makes
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

      const url = new URL(href, window.location.href)
      // external, or a hash/query jump within the current page — neither is a page change
      if (url.origin !== window.location.origin) return
      if (url.pathname === window.location.pathname) return

      e.preventDefault()
      // mid-transition clicks are dropped rather than queued: the curtain is over the link anyway
      if (phase !== 'idle') return

      setPhase('cover')
      startTransition(() => router.push(url.pathname + url.search + url.hash))
    }

    // capture, so this runs before next/link's own handler claims the event
    document.addEventListener('click', onClick, true)
    return () => document.removeEventListener('click', onClick, true)
  }, [phase, router])

  // covered and the route has committed -> lift
  useEffect(() => {
    if (phase === 'hold' && !isPending) reveal()
  }, [phase, isPending, reveal])

  useEffect(() => {
    if (phase === 'idle' || phase === 'hold') return
    const t = setTimeout(() => (phase === 'cover' ? setPhase('hold') : setPhase('idle')), FALLBACK_MS)
    return () => clearTimeout(t)
  }, [phase])

  if (phase === 'idle') return null

  return (
    <Curtain
      className={`route-curtain ${PHASE_CLASS[phase]}`}
      onAnimationEnd={(e) => {
        if (e.animationName.includes('curtain-in')) setPhase('hold')
        else if (e.animationName.includes('preloader-up')) setPhase('idle')
      }}
    />
  )
}
