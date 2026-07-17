// Section eyebrow: "[ WHO WE ARE ]". Brackets swing out from the centre while the label wipes up.
// No JS of its own — it animates off the nearest <InView> gate (styles.css keys everything to
// .reveal-gate.is-visible), so it shares one observer and one clock with the section's copy.
//
// Width is a plain Tailwind class on the caller (w-44 md:w-56 ...): the bracket travel derives from
// the element's own width via container queries, so it tracks whatever the breakpoint says. Color is
// the caller's too — it flips grey/pink per section.
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
      className={`bracket-label mx-auto flex justify-between font-mono text-xs font-medium uppercase tracking-tight md:text-sm 3xl:text-base ${className}`}
    >
      <p aria-hidden>{children}</p>
    </div>
  )
}
