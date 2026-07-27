// Section eyebrow: "[ WHO WE ARE ]". Brackets swing out from the centre while the label wipes up.
// No JS of its own — it animates off the nearest <InView> gate (styles.css keys everything to
// .reveal-gate.is-visible), so it shares one observer and one clock with the section's copy.
//
// karocrafts' arrangement: the brackets spread to the row's edges rather than hugging the text, so
// the label reads wide and airy. Width is a plain Tailwind class on the caller (w-44 md:w-56 ...) —
// the bracket travel derives from the element's own width via container queries, so it tracks
// whatever the breakpoint says.
//
// Color is the caller's: it flips per section (warm grey on cream, brand pink on dark).
export function BracketLabel({
  children,
  className = '',
}: {
  children: string
  className?: string
}) {
  return (
    <div
      aria-label={children}
      // mobile 14px (caption spec), desktop 24px (Figma heading/h5/l). tracking is letter-spacing/xxxl
      // — token value unknown, eyeballed off the 1120 frame; nudge here, not per caller.
      className={`bracket-label mx-auto flex justify-between font-mono text-[14px] font-normal uppercase leading-[1.4] tracking-[0.2em] md:text-[24px] ${className}`}
    >
      <p aria-hidden>{children}</p>
    </div>
  )
}
