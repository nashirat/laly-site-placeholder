import type { Metadata } from 'next'
import Script from 'next/script'
import { fontVariables } from '@/app/(frontend)/components/Fonts'
import { AnimationControlPanel } from '@/components/AnimationControlPanel'
import Footer from '@/components/Footer'
import Header from '@/components/Header'
import { Preloader } from '@/components/Preloader'
import { SmoothScroll } from '@/components/SmoothScroll'
import './styles.css'

export const metadata: Metadata = {
  title: 'Laly Agency',
  description: 'Laly Agency',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning className={`${fontVariables} preloading`}>
      <body className="relative min-h-screen antialiased font-sans">
        <Script id="animation-controls" strategy="beforeInteractive">
          {`try{var s=JSON.parse(localStorage.getItem('laly-animation-controls')||'{}');if(s.version!==3)s={};document.documentElement.classList.add('anim-heading-'+(s.heading==='letters'||s.heading==='mix'?s.heading:'fade'),'anim-sections-'+(s.sections==='fadeup'||s.sections==='brackets'?s.sections:'media'))}catch(e){document.documentElement.classList.add('anim-heading-fade','anim-sections-media')}`}
        </Script>
        <SmoothScroll />
        <Preloader />
        <Header />
        {children}
        <Footer />
        <AnimationControlPanel />
      </body>
    </html>
  )
}
