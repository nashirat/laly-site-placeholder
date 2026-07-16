'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/Button'
import { ScrambleText } from '@/components/ui/ScrambleText'

// MENU toggle + dropdown. Items masked; slide in from the right on open, slide out to the right on
// close, both staggered top->bottom. Geist Mono like the button; scramble-on-hover (mono).
const ITEMS = [
  { label: 'CASE STUDIES', href: '/case-studies' },
  { label: 'SERVICES', href: '/services' },
  { label: 'CONTACT', href: '/contact' },
  { label: 'ABOUT', href: '/about' },
]
const STAGGER = 0.06 // seconds between items
const DURATION = 1.2 // slide duration (matches the keyframes)
const EXIT_MS = ((ITEMS.length - 1) * STAGGER + DURATION) * 1000 + 50 // unmount after the exit stagger

type State = 'closed' | 'open' | 'closing'

export function NavMenu() {
  const [state, setState] = useState<State>('closed')

  // after the exit stagger finishes, unmount (timeout also covers reduced-motion, where no anim fires)
  useEffect(() => {
    if (state !== 'closing') return
    const t = setTimeout(() => setState('closed'), EXIT_MS)
    return () => clearTimeout(t)
  }, [state])

  const toggle = () => setState((s) => (s === 'open' ? 'closing' : 'open'))
  const closing = state === 'closing'

  return (
    <div className="relative">
      <Button onClick={toggle}>MENU</Button>

      {state !== 'closed' && (
        <nav
          aria-label="Primary"
          className="absolute right-0 top-full mt-4 flex flex-col items-end gap-1"
        >
          {ITEMS.map((item, i) => (
            <span key={item.label} className="inline-block overflow-hidden">
              <a
                href={item.href}
                className={`inline-block font-mono text-base font-medium text-[#262626] 3xl:text-lg ${
                  closing ? 'slide-out-right' : 'slide-in-right'
                }`}
                /* enter: top->bottom; exit: bottom->top */
                style={{ animationDelay: `${(closing ? ITEMS.length - 1 - i : i) * STAGGER}s` }}
              >
                <ScrambleText>{item.label}</ScrambleText>
              </a>
            </span>
          ))}
        </nav>
      )}
    </div>
  )
}
