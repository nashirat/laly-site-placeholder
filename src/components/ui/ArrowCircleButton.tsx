import Link from 'next/link'
import ArrowIcon from '../../../public/arrow_topright.svg'

// Circular keyline button with an up-right arrow. Static — no scramble, no motion (unlike Button).
// The svg is the whole thing, ring included: 40px as drawn, 32px on mobile.
// Its colours are baked in, so ring and glyph are repainted with currentColor — CSS outranks a
// presentation attribute — and the caller sets colour via the surrounding text colour.
export function ArrowCircleButton({
  href,
  label,
  size = 32,
  className = '',
}: {
  href?: string
  label: string
  size?: number // svg diameter in px
  className?: string
}) {
  const cls =
    `inline-flex shrink-0 items-center justify-center rounded-full ` +
    `[&_rect]:stroke-current [&_path]:fill-current [&_path]:stroke-current ` +
    `transition-colors ${className}`.trim()
  const icon = <ArrowIcon style={{ width: size, height: size }} />

  return href ? (
    <Link href={href} aria-label={label} className={cls} style={{ width: size, height: size }}>
      {icon}
    </Link>
  ) : (
    <button
      type="button"
      aria-label={label}
      className={cls}
      style={{ width: size, height: size }}
    >
      {icon}
    </button>
  )
}
