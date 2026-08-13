'use client'

import { useEffect, useState } from 'react'
import { Icon } from '@/components/Icon'
import { Button } from '@/components/ui/Button'
import { ScrambleText } from '@/components/ui/ScrambleText'
import type { HeaderContent } from '@/lib/types'

// MENU toggle + two dropdowns off the same state.
//
// md+ (unchanged): items masked, slide in from the right, staggered top->bottom.
// below md: the whole panel drops down from under the header bar — Figma 3038:1661. The old
// slide-in read as four pills floating over whatever was scrolled behind them, which is the
// contrast problem the designer flagged; the panel carries its own cream ground and keyline.
//
// bajgartoffice.com (the reference the designer sent) grows the panel's height from 0 under the
// bar. This slides the whole sheet down out of the bar instead — same read, but the keyline can
// then leave the same way it arrived rather than vanishing once the height hits 0. Framer runs its
// version as spring(bounce .2, duration .4). Brief here is slower and smooth at both ends: 850ms
// ease-in-out instead of a spring — no overshoot at all, since any overshoot IS the hard stop the
// eye reads at the end. Slightly front-loaded (0.5,0 not 0.37,0) so the tap still feels answered.
const STAGGER = 0.06 // seconds between items (md+ only)
const DURATION = 1.2 // slide duration (matches the keyframes)

type State = 'closed' | 'open' | 'closing'

export function NavMenu({ nav: items, socials = [], copyright }: HeaderContent) {
  const [state, setState] = useState<State>('closed')
  const exitMs = ((items.length - 1) * STAGGER + DURATION) * 1000 + 50 // unmount after exit stagger

  // after the exit stagger finishes, unmount (timeout also covers reduced-motion, where no anim fires)
  useEffect(() => {
    if (state !== 'closing') return
    const t = setTimeout(() => setState('closed'), exitMs)
    return () => clearTimeout(t)
  }, [state, exitMs])

  const toggle = () => setState((s) => (s === 'open' ? 'closing' : 'open'))
  const open = state === 'open'
  const closing = state === 'closing'

  return (
    <div className="relative">
      {/* no scramble here — the toggle just tints on hover (transition-colors is in the shell base).
          Label masks up to CLOSE on open; `closing` counts as closed so it drops back with the items. */}
      <Button
        onClick={toggle}
        scramble={false}
        className="hover:bg-black/5"
        altLabel="CLOSE"
        showAlt={open}
      >
        MENU
      </Button>

      {/* ---- md+ : unchanged ---- */}
      {state !== 'closed' && (
        <nav
          aria-label="Primary"
          /* top-full is the TOGGLE's bottom (55.5px down a 76px bar), not the bar's — mt-4 put the
             first pill 4.5px ABOVE the bar's edge, so it read as glued to it over dark sections.
             the bar's edge is 20.5px past top-full ((76 - 35)/2), so 24 lands the stack just clear
             of it. */
          className="absolute right-0 top-full mt-[23px] hidden flex-col items-end gap-1 md:flex"
        >
          {items.map((item, i) => (
            <span key={item.label} className="inline-block overflow-hidden">
              <a
                href={item.href}
                /* pilled like the toggle above — items float over dark sections and images once
                   scrolled, so each carries its own hero-cream surface instead of a full panel */
                className={`inline-block rounded-full bg-[#fffcf9] px-3 py-1.5 font-mono text-base font-medium text-[#262626] 3xl:text-lg ${
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

      {/* ---- below md : full-width drop-down panel ----
          Always mounted (a CSS transition needs both ends rendered) and always full height — the
          panel MOVES rather than growing. An animated clip was the first cut, but a clip has a
          floor: the keyline reaches the header's bottom edge and then has nowhere left to go, so it
          blinks out instead of leaving. Sliding the whole sheet up means the line keeps travelling
          past the edge and gets cut off by this wrapper, which is the same motion the rest of the
          panel makes.
          The wrapper is that cut: a fixed region starting exactly at the header's bottom, clipping
          everything above it. It has to be a separate box because NavMenu renders INSIDE <header> —
          the header is a z-50 stacking context, so nothing in here can paint behind its cream bar,
          and a plain z-index would not have hidden the sheet.
          pointer-events-none on the region, auto on the sheet: the region covers the whole viewport
          below the bar and would otherwise swallow every click on the page with the menu shut.
          `inert` keeps the links out of the tab order and off screen readers while closed. */}
      <div
        className="pointer-events-none fixed inset-x-0 top-19 bottom-0 z-40 overflow-hidden md:hidden"
        inert={!open}
      >
        {/* Figma: 20 padding, 48 between groups. The bar above already contributes 24 under the
            logo, so the top inset is the missing 44 rather than another 20. */}
        <nav
          aria-label="Primary"
          className={`pointer-events-auto flex flex-col items-center gap-12 border-b border-[#544D49] bg-[#fffcf9] px-5 pt-11 pb-5 transition-transform duration-[850ms] ease-[cubic-bezier(0.5,0,0.2,1)] motion-reduce:transition-none ${
            open ? 'translate-y-0' : '-translate-y-full'
          }`}
        >
          {/* one handler on the wrapper instead of per link: the header lives in the layout, so a
              route change never unmounts this and the panel would stay open behind the new page */}
          <div className="flex flex-col items-center gap-5" onClick={() => setState('closing')}>
            {items.map((item) => (
              <Button key={item.label} href={item.href}>
                {item.label}
              </Button>
            ))}
          </div>

          {socials.length > 0 && (
            <div className="flex items-center justify-center gap-3">
              {socials.map((s) => (
                <a
                  key={s.platform}
                  href={s.href ?? '#'}
                  aria-label={s.platform}
                  target="_blank"
                  rel="noreferrer"
                >
                  {/* the ring is part of the svg (a 32x32 rect), so 24px here is Figma's whole
                      24px button — no second border of our own */}
                  <Icon
                    name={s.platform}
                    className="h-6 w-6 [&_rect]:stroke-[#292624] [&_path]:fill-[#292624]"
                  />
                </a>
              ))}
            </div>
          )}

          {copyright && (
            <p className="text-center font-sans text-xs leading-[1.25] tracking-[0.25px] text-[#9F9188]">
              {copyright}
            </p>
          )}
        </nav>
      </div>
    </div>
  )
}
