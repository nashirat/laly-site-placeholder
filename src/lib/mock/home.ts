import type { StaticImageData } from 'next/image'
import img1 from '../../../public/carousel/1.png'
import img2 from '../../../public/carousel/2.png'
import img3 from '../../../public/carousel/3.png'
import img4 from '../../../public/carousel/4.png'
import img5 from '../../../public/carousel/5.png'
import senft from '../../../public/senft.png'
import vajra from '../../../public/vajra.png'
import type {
  AboutContent,
  ContactContent,
  HeroContent,
  MediaDoc,
  StrategyContent,
  WhoWeAreContent,
} from '@/lib/types'

// Stand-in for the Pages "home" doc until Payload exists (Phase 4 deletes this file).
// Static imports already carry dims + a generated blurDataURL, i.e. the same fields a Media doc
// has — so we adapt them to MediaDoc here and the components never learn where images came from.
const toMedia = (img: StaticImageData, alt: string): MediaDoc => ({
  url: img.src,
  width: img.width,
  height: img.height,
  blurDataURL: img.blurDataURL,
  alt,
})

export const home: {
  hero: HeroContent
  whoWeAre: WhoWeAreContent
  strategy: StrategyContent
  about: AboutContent
  contact: ContactContent
} = {
  hero: {
    heading: 'Marketing you can follow.\nGrowth you can feel.',
    // no \n — body copy wraps to the viewport (the heading keeps its authored 2-line break)
    description:
      'Optimize your workflows, build your brand, and scale your business with a tech-forward in-house marketing team.',
    button: { label: "LET'S BEGIN" },
    slides: [
      toMedia(img1, 'Senft Legal billboard campaign'),
      toMedia(img2, 'Mobile commerce app screens'),
      toMedia(img3, 'Brand stationery mockup'),
      toMedia(img4, 'Editorial landing page design'),
      toMedia(img5, 'Product photography art direction'),
    ],
  },
  whoWeAre: {
    label: 'Who we are', // bare text — BracketLabel supplies the [ ] and uppercases it
    heading: 'Do you know where your\nmarketing dollars are going?',
    description:
      "50% of Businesses Fail After Just 5 Years. The Culprit? Wasted Marketing Dollars. But It Doesn't Have to Be That Way. This Could Be Us:",
    cards: [
      {
        image: toMedia(senft, 'Senft Legal billboard'),
        title: 'Senft Legal',
        body: 'Senft Legal is a personal injury law firm founded in South Florida in 1991. After 3 years of working with Laly, Senft Legal has an established revenue stream in four states with an active plan for nationwide growth.',
        stat: { value: '133%', label: 'Lead\nIncrease' },
        link: { label: 'EXPLORE' },
        bg: '#caca86',
        border: '#57570F',
        fg: '#313008',
        muted: '#57570F',
      },
      {
        image: toMedia(vajra, 'Vajra Jahra retreat waterfall'),
        title: 'Vajra Jahra',
        body: 'Vajra Jahra is a Costa Rica retreat center built in 2023. Vajra Jahra partnered with Laly in 2025, going from 0 bookings to 9. In 2026, Vajra Jahra has already increased revenue by 150% and is on track to be fully booked out for two full calendar years.',
        stat: { value: '150%', label: 'Revenue\nGrowth' },
        link: { label: 'EXPLORE' },
        bg: '#f3e8f2',
        border: '#716370',
        fg: '#3a2f39',
        muted: '#716370',
      },
    ],
  },
  strategy: {
    label: 'Strategy',
    heading: 'How we help you grow.',
    // no \n — the design's 2-line break is just where it lands at that width; max-w does that job
    description: 'You don’t need to spend more—you need to spend smarter.',
    cards: [
      {
        title: 'The Power of Paid\nAdvertisement',
        badges: [
          { label: 'Social Media Strategy', color: '#A2A11C' },
          { label: 'Meta-Optimized Ads', color: '#F3E8F2' },
          { label: 'Scalable Ads', color: '#F5C882' },
        ],
        hook: "If you're looking for a new stream of high-quality leads, this is for you.",
        body: 'Pay for website traffic that translates to a reliable stream of new clients for your business, every month.',
        link: { label: 'Explore paid advertisement' },
        fg: '#E5CBE2',
      },
      {
        title: 'The Power of\nBranding',
        badges: [
          { label: 'Brand Strategy', color: '#A2A11C' },
          { label: 'Brand Book & Guidelines', color: '#F3E8F2' },
          { label: 'Web Design', color: '#F5C882' },
        ],
        hook: 'If your business depends on referrals, this is for you.',
        body: 'Selling a service gets you one-time clients; selling a brand gets you loyal customers. Build and establish your brand on search engines, social media, and beyond, with a clear, recognizable offering that everyone remembers.',
        link: { label: 'Explore branding' },
        fg: '#DFA854',
      },
      // ponytail: card 3 copy is a stand-in — the Figma frame is cropped. Swap when you have it.
      {
        title: 'The Power of\nTechnology',
        badges: [
          { label: 'Custom Software', color: '#A2A11C' },
          { label: 'Automation', color: '#F3E8F2' },
          { label: 'AI Integration', color: '#F5C882' },
        ],
        hook: 'If your team is buried in busywork, this is for you.',
        body: 'We customize everything to your business, so the tools work the way you already do—not the other way around.',
        link: { label: 'Explore technology' },
        fg: '#B5B449',
      },
    ],
  },
  about: {
    label: 'About us',
    heading: 'Your In-House\nMarketing Team.',
    description: 'Meet the friendly faces here to nurture your brand’s growth.',
    // No `photo` yet — each member renders the placeholder frame. Drop headshots in as they arrive.
    // `role` is the info-bar line; the \n is the authored 2-line break (rendered via whitespace-pre-line).
    members: [
      { name: 'Cindy Ripoll', role: 'The trusty team leader\nand your first point of contact.' },
      { name: 'Team Member', role: 'The steady hand\nkeeping every campaign on track.' },
      { name: 'Team Member', role: 'The creative spark\nbehind the brand you remember.' },
    ],
    story: { label: 'OUR STORY' },
  },
  contact: {
    label: 'Contact',
    heading: 'GROW\nWITH US.', // the break is the design; this one is display type, not body copy
    buttons: [{ label: "LET'S BEGIN" }, { label: 'BOOK A CALL' }],
  },
}
