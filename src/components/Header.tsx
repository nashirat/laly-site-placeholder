import { NavMenu } from '@/components/NavMenu'
import { header } from '@/lib/mock/globals'

// Site navbar. Pinned to the viewport (fixed) — floats over every section, no flow height, so the
// hero's pt-19 still does the reserving. Sits under the preloader's z-[100].
// Opaque cream, matching the hero, so it reads as one surface there and masks the dark sections
// scrolling underneath instead of letting the dark-on-dark logo disappear.
// px-5 (20px) from Figma spacing/20; height standardized to h-19 (76px ≈ Figma 75px).
// Logo = plain <img> from /public (svg needs no next/image optimization, no svgr).
// Reads the Header global — mocked now, a cached Payload fetch in Phase 3 (this stays a server
// component, so that swap is just awaiting the fetch here).
export default function Header() {
  return (
    <header className="fixed inset-x-0 top-0 z-50 flex h-19 items-center justify-between bg-[#fffcf9] px-5 sm:px-10">
      <img src="/primarylogo.svg" alt="Laly" width={120} height={28} className="h-7 w-30" />
      <NavMenu items={header.nav} />
    </header>
  )
}
