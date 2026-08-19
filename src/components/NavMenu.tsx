'use client'

import { useState } from 'react'
import { Icon } from '@/components/Icon'
import { Button } from '@/components/ui/Button'
import type { HeaderContent } from '@/lib/types'

// MENU toggle + the drop-down panel it opens — Figma 3038:1661, now at every width.
//
// The panel drops down from under the header bar carrying its own cream ground and keyline. md+ used
// to get something else entirely: four pills sliding in from the right, staggered, each with its own
// rounded surface. That read as pills floating over whatever was scrolled behind them, which is the
// contrast problem the designer flagged on mobile — so desktop now takes the same sheet. The ground
// runs the full width at both sizes; only the contents change side, centred below md and right
// aligned at md+, under the toggle they came out of.
//
// bajgartoffice.com (the reference the designer sent) grows the panel's height from 0 under the
// bar. This slides the whole sheet down out of the bar instead — same read, but the keyline can
// then leave the same way it arrived rather than vanishing once the height hits 0. Framer runs its
// version as spring(bounce .2, duration .4). Brief here is slower and smooth at both ends: 850ms
// ease-in-out instead of a spring — no overshoot at all, since any overshoot IS the hard stop the
// eye reads at the end. Slightly front-loaded (0.5,0 not 0.37,0) so the tap still feels answered.
export function NavMenu({ nav: items, socials = [], copyright }: HeaderContent) {
  const [open, setOpen] = useState(false)

  return (
    <div className="relative">
      {/* no scramble here — the toggle just tints on hover (transition-colors is in the shell base).
          Label masks up to CLOSE while the panel is down. */}
      <Button
        onClick={() => setOpen((o) => !o)}
        scramble={false}
        className="hover:bg-black/5"
        altLabel="CLOSE"
        showAlt={open}
      >
        MENU
      </Button>

      {/* Always mounted (a CSS transition needs both ends rendered) and always full height — the
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
        className="pointer-events-none fixed inset-x-0 top-19 bottom-0 z-40 overflow-hidden"
        inert={!open}
      >
        {/* Figma: 20 padding, 48 between groups. The bar above already contributes 24 under the
            logo, so the top inset is the missing 44 rather than another 20.
            md+ right-aligns and takes the header's own 40px side inset, so the links land under the
            toggle rather than in the middle of an empty sheet. */}
        <nav
          aria-label="Primary"
          className={`pointer-events-auto flex flex-col items-center gap-12 border-b border-[#544D49] bg-[#fffcf9] px-5 pt-11 pb-5 transition-transform duration-[850ms] ease-[cubic-bezier(0.5,0,0.2,1)] motion-reduce:transition-none sm:px-10 md:items-end ${
            open ? 'translate-y-0' : '-translate-y-full'
          }`}
        >
          {/* one handler on the wrapper instead of per link: the header lives in the layout, so a
              route change never unmounts this and the panel would stay open behind the new page */}
          <div
            className="flex flex-col items-center gap-5 md:items-end"
            onClick={() => setOpen(false)}
          >
            {items.map((item) => (
              <Button key={item.label} href={item.href}>
                {item.label}
              </Button>
            ))}
          </div>

          {socials.length > 0 && (
            <div className="flex items-center justify-center gap-3 md:justify-end">
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
            <p className="text-center font-sans text-xs leading-[1.25] tracking-[0.25px] text-[#9F9188] md:text-right">
              {copyright}
            </p>
          )}
        </nav>
      </div>
    </div>
  )
}
