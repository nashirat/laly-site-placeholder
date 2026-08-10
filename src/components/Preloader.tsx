'use client'

import Image from 'next/image'
import { useEffect, useState } from 'react'
import logo from '../../public/blacklogo.png'
import { PRELOADER_CLOSE_DURATION, PRELOADER_HOLD } from '@/lib/motion'

// Full-screen curtain: covers the page from the very first paint (no entrance animation — it is
// simply already there), holds, then slides up to reveal. It covers before hydration, so page cannot
// flash before client state starts the close sequence.
//
// State sequence: preloading -> preloading-done (starts the slide-up and hero entry) ->
// preloader-done (curtain unmounts). This is why the component is client.
//
// The curtain itself is <Curtain> below, shared with RouteTransition — same pink, same logo, same
// 1.2s easeInOutQuint — but the two run on separate clocks and separate state, on purpose: this one
// fires once at first paint, that one fires per navigation.
export function Preloader() {
  const [state, setState] = useState<'preloading' | 'preloading-done' | 'preloader-done'>('preloading')

  useEffect(() => {
    const root = document.documentElement
    const setPreloaderState = (next: typeof state) => {
      root.classList.remove('preloading', 'preloading-done', 'preloader-done')
      root.classList.add(next)
      setState(next)
    }

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setPreloaderState('preloader-done')
      return
    }

    setPreloaderState('preloading')
    const holdTimer = setTimeout(() => setPreloaderState('preloading-done'), PRELOADER_HOLD * 1000)
    return () => clearTimeout(holdTimer)
  }, [])

  useEffect(() => {
    if (state !== 'preloading-done') return

    // animationend is primary. This covers a missed event in a backgrounded tab.
    const closeTimer = setTimeout(() => {
      const root = document.documentElement
      root.classList.remove('preloading-done')
      root.classList.add('preloader-done')
      setState('preloader-done')
    }, (PRELOADER_CLOSE_DURATION + 0.2) * 1000)
    return () => clearTimeout(closeTimer)
  }, [state])

  if (state === 'preloader-done') return null

  return (
    <Curtain
      className="preloader"
      // animationend bubbles from children too; the logo doesn't animate, but guard by name anyway.
      onAnimationEnd={(e) => {
        if (e.animationName.includes('preloader-up')) {
          document.documentElement.classList.remove('preloading-done')
          document.documentElement.classList.add('preloader-done')
          setState('preloader-done')
        }
      }}
    />
  )
}

// The curtain, markup only — who slides it and when is the caller's business. Kept here rather than
// in its own file because Preloader is the reason it exists; RouteTransition is the second caller.
export function Curtain({
  className = '',
  onAnimationEnd,
}: {
  className?: string
  onAnimationEnd?: (e: React.AnimationEvent<HTMLDivElement>) => void
}) {
  return (
    <div
      aria-hidden
      onAnimationEnd={onAnimationEnd}
      className={`fixed inset-0 z-[100] flex items-center justify-center bg-[#ff6d6a] ${className}`}
    >
      {/* on first load this is the first thing painted -> the LCP element, so it must not lazy-load */}
      <Image
        src={logo}
        alt="Laly Agency"
        priority
        quality={100}
        sizes="120px"
        className="h-7 w-30" /* matches the navbar logo exactly (Header.tsx) */
      />
    </div>
  )
}
