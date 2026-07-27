import { footer } from '@/lib/mock/globals'

// Site footer global — cream ground under the Note band. Four columns spread across the 1440 frame:
// logo | NAV | CONTACT | copyright. Figma padding 48/48/20/48 (top/right/bottom/left), gap 48.
// Server component reading the Footer global (mocked now, a cached Payload fetch in Phase 3).
// Logo = plain <img> from /public (svg needs no next/image, no svgr). Figma size 400x93.
export default function Footer() {
  return (
    <footer className="w-full bg-[#fffcf9]">
      {/* mobile: 48 top / 20 sides / 20 bottom, three blocks 48 apart — logo, the NAV+CONTACT
          column, then the copyright */}
      <div className="mx-auto flex max-w-[1440px] flex-col items-center gap-12 px-5 pt-12 pb-5 md:flex-row md:items-start md:justify-between md:gap-12 md:px-12 md:pb-14 md:pt-12 3xl:max-w-[1600px] 3xl:gap-16 3xl:px-16 3xl:pb-16 3xl:pt-16">
        <img
          src="/primarylogo.svg"
          alt="Laly Agency"
          width={400}
          height={94}
          className="h-auto w-[300px] md:w-[400px] 3xl:w-[480px]"
        />

        {/* NAV and CONTACT are one block on mobile — 80 between the two groups, 20 under them.
            The wrapper dissolves at md+ so the desktop four-column row is unchanged. */}
        <div className="flex flex-col items-center gap-20 pb-5 md:contents">
        {/* 32 from the title to the list, 12 between links */}
        <nav className="flex flex-col items-center gap-8 md:gap-2">
          <p className="font-mono text-lg font-normal uppercase leading-[1.4] tracking-[0.2em] text-[#867A72] md:mb-4">[ Nav ]</p>
          <div className="flex flex-col items-center gap-3 md:gap-2">
            {footer.nav.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="font-sans text-xl leading-[1.25] tracking-[-0.01em] text-[#262626] transition-opacity hover:opacity-60"
              >
                {link.label}
              </a>
            ))}
          </div>
        </nav>

        <div className="flex flex-col items-center gap-8 md:gap-2">
          <p className="font-mono text-lg font-normal uppercase leading-[1.4] tracking-[0.2em] text-[#867A72] md:mb-4">[ Contact ]</p>
          <div className="flex flex-col items-center gap-3 md:gap-2">
            <a
              href={`mailto:${footer.email}`}
              className="font-sans text-xl leading-[1.25] tracking-[-0.01em] text-[#262626] transition-opacity hover:opacity-60"
            >
              {footer.email}
            </a>
            <a
              href={`tel:${footer.phone.replace(/[^\d+]/g, '')}`}
              className="font-sans text-xl leading-[1.25] tracking-[-0.01em] text-[#262626] transition-opacity hover:opacity-60"
            >
              {footer.phone}
            </a>
          </div>
        </div>
        </div>

        {/* heading/h4/xs: New Spirit Condensed 400 / 18 / 140% / letter-spacing s / #FF6D6A */}
        <p className="font-sans text-lg font-normal leading-[1.4] tracking-[-0.02em] text-[#FF6D6A]">
          {footer.copyright}
        </p>
      </div>
    </footer>
  )
}
