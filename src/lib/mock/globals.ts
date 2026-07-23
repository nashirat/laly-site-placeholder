import type { FooterContent, HeaderContent } from '@/lib/types'

// Stand-in for the Header global until Payload exists (Phase 3 replaces this with a cached fetch).
export const header: HeaderContent = {
  nav: [
    { label: 'CASE STUDIES', href: '/case-studies' },
    { label: 'SERVICES', href: '/services' },
    { label: 'CONTACT', href: '/contact' },
    { label: 'ABOUT', href: '/about' },
  ],
}

// Stand-in for the Footer global until Payload exists.
export const footer: FooterContent = {
  nav: [
    { label: 'Home', href: '/' },
    { label: 'Services', href: '/services' },
    { label: 'About', href: '/about' },
    { label: 'Contact', href: '/contact' },
  ],
  email: 'grow@laly.agency',
  phone: '(555) 825 - 4767',
  copyright: '© LALY AGENCY . 2026',
}
