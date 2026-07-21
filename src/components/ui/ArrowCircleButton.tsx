import Image from 'next/image'
import Link from 'next/link'
import arrow from '../../../public/arrow-up-right.png'

// Circular keyline button with an up-right arrow. Static — no scramble, no motion (unlike Button).
// Border/tint inherit `currentColor`, so the caller sets colour via the surrounding text colour.
// Used on the mobile case-study card where the EXPLORE pill collapses to this icon.
export function ArrowCircleButton({
  href,
  label,
  size = 32,
  className = '',
}: {
  href?: string
  label: string
  size?: number // circle diameter in px; the arrow stays 20px
  className?: string
}) {
  const cls =
    `inline-flex shrink-0 items-center justify-center rounded-full border border-current ` +
    `transition-colors hover:bg-black/5 ${className}`.trim()
  const style = { width: size, height: size }
  const icon = <Image src={arrow} alt="" width={20} height={20} className="h-5 w-5" />

  return href ? (
    <Link href={href} aria-label={label} className={cls} style={style}>
      {icon}
    </Link>
  ) : (
    <button type="button" aria-label={label} className={cls} style={style}>
      {icon}
    </button>
  )
}
