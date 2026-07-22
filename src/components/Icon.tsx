import type { FC, SVGProps } from 'react'
import Facebook from '../../public/facebook.svg'
import Instagram from '../../public/instagram.svg'
import Tiktok from '../../public/tiktok.svg'
import Youtube from '../../public/youtube.svg'
import Logo from './icons/logo.svg'

// Inline SVG-as-component (svgr, icon:true) — styleable via className, no image request.
// ponytail: static imports fine for a handful of icons; switch to next/dynamic per-icon
// if the registry grows large enough to bloat first-load JS.
export const iconRegistry = {
  logo: Logo,
  // socials: 32x32, ringed, stroke/fill baked as #151414 (svgo off, so the source colors stand)
  instagram: Instagram,
  tiktok: Tiktok,
  youtube: Youtube,
  facebook: Facebook,
} satisfies Record<string, FC<SVGProps<SVGSVGElement>>>

export type IconName = keyof typeof iconRegistry

export function Icon({ name, ...props }: { name: IconName } & SVGProps<SVGSVGElement>) {
  const Cmp = iconRegistry[name]
  return Cmp ? <Cmp {...props} /> : null
}
