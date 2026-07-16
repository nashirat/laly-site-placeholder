import Image from 'next/image'
import logo from '../../public/blacklogo.png'
import { PRELOADER_HOLD } from '@/lib/motion'

// Full-screen curtain: covers the page from the very first paint (no entrance animation — it is
// simply already there), holds, then slides up to reveal. Pure CSS on the paint clock, so it can't
// flash the page before hydration the way a mount-gated overlay would.
// Later: the same component doubles as the route-transition curtain (slide down to cover, up to
// reveal) — that direction needs client state, so it stays a separate concern.
export function Preloader() {
  return (
    <div
      aria-hidden
      className="preloader fixed inset-0 z-[100] flex items-center justify-center bg-[#ff6d6a]"
      style={{ animationDelay: `${PRELOADER_HOLD}s` }}
    >
      {/* the first thing painted -> this is the LCP element, so it must not lazy-load */}
      <Image
        src={logo}
        alt="Laly Agency"
        priority
        sizes="120px"
        className="h-7 w-30" /* matches the navbar logo exactly (Header.tsx) */
      />
    </div>
  )
}
