'use client'

import Link from 'next/link'
import type { ReactNode } from 'react'
import { useScramble } from '@/components/ui/ScrambleText'

// Presentational button primitive — styling + scramble-on-hover. No CMS logic.
// Label is Chivo Mono (font-mono): mono keeps the decrypt width-stable, no jitter/overlap, so the
// scramble is a single span. href -> Next <Link>, else <button>. Trigger is the whole button.
// Payload later: a CMSButton adapter maps the `button` field (type/page/link/styling) onto this.

const SHELL_BASE =
  'inline-flex cursor-pointer items-center justify-center rounded-full px-2 py-1 ' +
  'shadow-[0_1px_2px_0_rgba(16,24,40,0.08)] transition-colors'
const TYPE = 'font-mono text-base font-medium leading-[23px] whitespace-nowrap 3xl:text-lg 3xl:leading-[26px]'

// variant changes ONLY the base look + the scramble flash color — not the hover text color.
const VARIANTS = {
  // outline: dark keyline + text; decrypt chars flash the logo color
  outline: {
    shell: 'border-[0.5px] border-[#262626] text-[#262626]',
    flash: '#ff6d6a',
  },
  // solid: filled, white text; decrypt chars stay white (no color change)
  solid: {
    shell: 'border-[0.5px] border-transparent bg-[#262626] text-white',
    flash: '#ffffff',
  },
  // primary: brand-pink fill, dark text; hover darkens the fill; no color flash
  primary: {
    shell: 'bg-[#ff6d6a] text-[#262626] hover:bg-[#ff7e7b]',
    flash: '#262626',
  },
} as const

type Variant = keyof typeof VARIANTS

type Props = {
  children: string
  href?: string
  variant?: Variant
  icon?: ReactNode
  scramble?: boolean
  scrambleColor?: string // overrides the variant's flash color
  className?: string
  onClick?: () => void
}

export function Button({
  children,
  href,
  variant = 'outline',
  icon,
  scramble = true,
  scrambleColor,
  className = '',
  onClick,
}: Props) {
  const flash = scrambleColor ?? VARIANTS[variant].flash
  const { ref, run } = useScramble<HTMLSpanElement>(children, flash)
  const onMouseEnter = scramble ? run : undefined

  const label = (
    <span className={`inline-flex items-center gap-1.5 ${TYPE}`}>
      {icon}
      {scramble ? (
        <span ref={ref} className="whitespace-nowrap">
          {children}
        </span>
      ) : (
        children
      )}
    </span>
  )
  const cls = `${SHELL_BASE} ${VARIANTS[variant].shell} ${className}`.trim()

  return href ? (
    <Link href={href} aria-label={children} className={cls} onMouseEnter={onMouseEnter}>
      {label}
    </Link>
  ) : (
    <button
      type="button"
      aria-label={children}
      className={cls}
      onClick={onClick}
      onMouseEnter={onMouseEnter}
    >
      {label}
    </button>
  )
}
