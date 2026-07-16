import { NavMenu } from '@/components/NavMenu'

// Site navbar. Overlays the section (absolute, transparent) — floats on top, no flow height.
// px-5 (20px) from Figma spacing/20; height standardized to h-19 (76px ≈ Figma 75px).
// Logo = plain <img> from /public (svg needs no next/image optimization, no svgr).
export default function Header() {
  return (
    <header className="absolute inset-x-0 top-0 z-50 flex h-19 items-center justify-between px-5">
      <img src="/primarylogo.svg" alt="Laly" width={120} height={28} className="h-7 w-30" />
      <NavMenu />
    </header>
  )
}
