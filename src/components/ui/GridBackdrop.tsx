// The faint grid behind the cream sections on /branding and /paid-advertising (Figma 2724:3687).
// Pure CSS rather than the old grid.webp: the image was object-cover'd into sections of wildly
// different heights, so each one drew the grid at its own scale. The cell size and the bottom fade
// live in .grid-backdrop (styles.css).
export function GridBackdrop({ className = '' }: { className?: string }) {
  return (
    <div aria-hidden className={`grid-backdrop pointer-events-none absolute inset-0 ${className}`} />
  )
}
