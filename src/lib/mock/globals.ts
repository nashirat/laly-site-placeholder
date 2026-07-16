import type { HeaderContent } from '@/lib/types'

// Stand-in for the Header global until Payload exists (Phase 3 replaces this with a cached fetch).
export const header: HeaderContent = {
  nav: [
    { label: 'CASE STUDIES', href: '/case-studies' },
    { label: 'SERVICES', href: '/services' },
    { label: 'CONTACT', href: '/contact' },
    { label: 'ABOUT', href: '/about' },
  ],
}
