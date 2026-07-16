import type { FC, SVGProps } from 'react'
import Logo from './icons/logo.svg'

// Inline SVG-as-component (svgr, icon:true) — styleable via className, no image request.
// ponytail: static imports fine for a handful of icons; switch to next/dynamic per-icon
// if the registry grows large enough to bloat first-load JS.
export const iconRegistry = {
  logo: Logo,
} satisfies Record<string, FC<SVGProps<SVGSVGElement>>>

export type IconName = keyof typeof iconRegistry

export function Icon({ name, ...props }: { name: IconName } & SVGProps<SVGSVGElement>) {
  const Cmp = iconRegistry[name]
  return Cmp ? <Cmp {...props} /> : null
}
