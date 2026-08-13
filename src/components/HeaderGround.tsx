'use client'

import { usePathname } from 'next/navigation'
import { useEffect } from 'react'

// Tells the navbar when it has left a dark hero. `.hero-dark` alone made the bar transparent for the
// whole page — right while the hero is the ground under it, wrong the moment a cream section
// scrolls up behind it (the light logo then sits on cream, and the page shows through the bar).
//
// Stamps `data-past-hero` on <body>; styles.css gates the transparent-bar rules on its absence, so
// the bar falls back to its own cream ground with no per-page knowledge.
//
// ponytail: a scroll listener, not IntersectionObserver — the answer is one number compared to
// scrollY, and IO would need a sentinel element in the hero to watch. Reruns on navigation because
// the layout (and so this component) never unmounts between routes.
const BAR = 76 // header h-19

export function HeaderGround() {
  const pathname = usePathname()

  useEffect(() => {
    const hero = document.querySelector<HTMLElement>('.hero-dark')
    if (!hero) {
      document.body.removeAttribute('data-past-hero')
      return
    }

    const update = () =>
      document.body.toggleAttribute('data-past-hero', window.scrollY > hero.offsetHeight - BAR)

    update()
    window.addEventListener('scroll', update, { passive: true })
    window.addEventListener('resize', update)
    return () => {
      window.removeEventListener('scroll', update)
      window.removeEventListener('resize', update)
      document.body.removeAttribute('data-past-hero')
    }
  }, [pathname])

  return null
}
