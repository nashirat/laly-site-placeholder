import type { Metadata } from 'next'
import { fontVariables } from '@/app/(frontend)/components/Fonts'
import Footer from '@/components/Footer'
import Header from '@/components/Header'
import { Preloader } from '@/components/Preloader'
import { RouteTransition } from '@/components/RouteTransition'
import { SmoothScroll } from '@/components/SmoothScroll'
import './styles.css'

export const metadata: Metadata = {
  title: 'Laly Agency',
  description: 'Laly Agency',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  // the anim-* classes pick the shipped animation variant; they were runtime-switchable while the
  // control panel existed, now they're just the chosen pair (see styles.css).
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${fontVariables} preloading anim-heading-fade anim-sections-media`}
    >
      <body className="relative min-h-screen antialiased font-sans">
        <SmoothScroll />
        <Preloader />
        <RouteTransition />
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  )
}
