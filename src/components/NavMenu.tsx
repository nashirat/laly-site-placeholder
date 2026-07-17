'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/Button'
import { ScrambleText } from '@/components/ui/ScrambleText'
import type { HeaderContent } from '@/lib/types'

// MENU toggle + dropdown. Items masked; slide in from the right on open, slide out to the right on
// close, both staggered top->bottom. Geist Mono like the button; scramble-on-hover (mono).
// Items come from the Header global (mocked for now) — order is whatever the CMS says.
const STAGGER = 0.06 // seconds between items
const DURATION = 1.2 // slide duration (matches the keyframes)

type State = 'closed' | 'open' | 'closing'

export function NavMenu({ items }: { items: HeaderContent['nav'] }) {
  const [state, setState] = useState<State>('closed')
  const exitMs = ((items.length - 1) * STAGGER + DURATION) * 1000 + 50 // unmount after exit stagger

  // after the exit stagger finishes, unmount (timeout also covers reduced-motion, where no anim fires)
  useEffect(() => {
    if (state !== 'closing') return
    const t = setTimeout(() => setState('closed'), exitMs)
    return () => clearTimeout(t)
  }, [state, exitMs])

  const toggle = () => setState((s) => (s === 'open' ? 'closing' : 'open'))
  const closing = state === 'closing'

  return (
    <div className="relative">
      {/* no scramble here — the toggle just tints on hover (transition-colors is in the shell base) */}
      <Button onClick={toggle} scramble={false} className="hover:bg-black/5">
        MENU
      </Button>

      {state !== 'closed' && (
        <nav
          aria-label="Primary"
          className="absolute right-0 top-full mt-4 flex flex-col items-end gap-1"
        >
          {items.map((item, i) => (
            <span key={item.label} className="inline-block overflow-hidden">
              <a
                href={item.href}
                className={`inline-block font-mono text-base font-medium text-[#262626] 3xl:text-lg ${
                  closing ? 'slide-out-right' : 'slide-in-right'
                }`}
                /* enter: top->bottom; exit: bottom->top */
                style={{ animationDelay: `${(closing ? items.length - 1 - i : i) * STAGGER}s` }}
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
