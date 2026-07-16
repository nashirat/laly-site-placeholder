import type { Metadata } from 'next'
import './styles.css'

export const metadata: Metadata = {
  title: 'Laly Agency',
  description: 'Laly Agency',
}

// ponytail: system font stack for now — swap to next/font brand faces when Figma lands
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen antialiased font-sans">{children}</body>
    </html>
  )
}
