import { footer } from '@/lib/mock/globals'

// Site footer global — cream ground under the Note band. Four columns spread across the 1440 frame:
// logo | NAV | CONTACT | copyright. Figma padding 48/48/20/48 (top/right/bottom/left), gap 48.
// Server component reading the Footer global (mocked now, a cached Payload fetch in Phase 3).
// Logo = plain <img> from /public (svg needs no next/image, no svgr). Figma size 400x93.
export default function Footer() {
  return (
    <footer className="w-full bg-[#fffcf9]">
      <div className="mx-auto flex max-w-[1440px] flex-col items-center gap-8 px-5 pt-10 pb-28 md:flex-row md:items-start md:justify-between md:gap-12 md:px-12 md:pb-14 md:pt-12 3xl:max-w-[1600px] 3xl:gap-16 3xl:px-16 3xl:pb-16 3xl:pt-16">
        <img
          src="/primarylogo.svg"
          alt="Laly Agency"
          width={400}
          height={94}
          className="h-auto w-[240px] md:w-[400px] 3xl:w-[480px]"
        />

        <nav className="flex flex-col items-center gap-2">
          <p className="mb-4 font-mono text-sm uppercase tracking-[0.2em] text-[#867A72] 3xl:text-base">[ Nav ]</p>
          {footer.nav.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="font-sans text-lg text-[#151414] transition-opacity hover:opacity-60 3xl:text-xl"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="flex flex-col items-center gap-2">
          <p className="mb-4 font-mono text-sm uppercase tracking-[0.2em] text-[#867A72] 3xl:text-base">[ Contact ]</p>
          <a
            href={`mailto:${footer.email}`}
            className="font-sans text-lg text-[#151414] transition-opacity hover:opacity-60 3xl:text-xl"
          >
            {footer.email}
          </a>
          <a
            href={`tel:${footer.phone.replace(/[^\d+]/g, '')}`}
            className="font-sans text-lg text-[#151414] transition-opacity hover:opacity-60 3xl:text-xl"
          >
            {footer.phone}
          </a>
        </div>

        {/* heading/h4/xs: New Spirit Condensed (font-sans) 400 / 18px / 140% / tight tracking, #FF6D6A */}
        <p className="font-sans text-lg font-normal leading-[1.4] tracking-tight text-[#FF6D6A] 3xl:text-xl">
          {footer.copyright}
        </p>
      </div>
    </footer>
  )
}
