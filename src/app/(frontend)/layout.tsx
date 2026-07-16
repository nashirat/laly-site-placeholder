import type { Metadata } from 'next'
import { fontVariables } from '@/app/(frontend)/components/Fonts'
import Header from '@/components/Header'
import './styles.css'

export const metadata: Metadata = {
  title: 'Laly Agency',
  description: 'Laly Agency',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={fontVariables}>
      <body className="relative min-h-screen antialiased font-sans">
        <Header />
        {children}
      </body>
    </html>
  )
}
