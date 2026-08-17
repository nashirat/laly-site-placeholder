import type { ReactNode } from 'react'
import { ScratchCover } from '@/components/ui/ScratchCover'

// Figma 2724:4151 — the one-line cream band on /branding, hidden under a scratch panel. Full-bleed,
// and it hugs the revealed copy, so the cover never changes the section's height when it goes.
//
// /paid-advertising draws the same band (2234:4105 covered / 2581:2753 revealed) and keeps its own
// copy of this markup inline: that page is signed off and frozen.
//
// The copy is `children` rather than a string: this one changes face mid-sentence, and ScratchCover
// only paints over whatever DOM it is given.
export function ScratchBand({
  label,
  scratchLabel,
  children,
}: {
  label: string // the section's accessible name
  scratchLabel: string // the prompt printed on the cover
  children: ReactNode
}) {
  return (
    // px 20 / py 48 at every width (Figma sets the same on both frames)
    <section
      aria-label={label}
      className="relative w-full overflow-hidden bg-[#FCF7F3] px-5 py-12"
    >
      {/* whitespace-pre-line, so the break the editor typed is the break that renders — a designer's
          two lines, not a wrap.
          28px at every width: mobile (2581:2753) sets the same heading/h3/s as desktop, so a long
          line runs to the padding on a 375px phone and wraps once more there. */}
      <p className="whitespace-pre-line text-center font-sans text-[28px] leading-[1.25] tracking-[-0.5px] text-[#FF6D6A]">
        {children}
      </p>
      <ScratchCover label={scratchLabel} />
    </section>
  )
}
