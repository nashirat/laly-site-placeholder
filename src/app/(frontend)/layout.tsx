import type { Metadata } from 'next'
import { fontVariables } from '@/app/(frontend)/components/Fonts'
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
    <html lang="en" className={fontVariables}>
      <body className="relative min-h-screen antialiased font-sans">
        <SmoothScroll />
        <Preloader />
        <Header />
        {children}
      </body>
    </html>
  )
}
