import type { StaticImageData } from 'next/image'
// Two crops per member — see TeamMember in src/lib/types.ts. The `mobile/` file is the portrait one.
import adam from '../../../public/aboutus/Adam-Jobson.webp'
import cindy from '../../../public/aboutus/Cindy-Ripoll.webp'
import diya from '../../../public/aboutus/Diya-Afreen.webp'
import fran from '../../../public/aboutus/Francesca-Sequani.webp'
import harry from '../../../public/aboutus/Harry-Mussotte.webp'
import leo from '../../../public/aboutus/Leo-Sequani.webp'
import adamMobile from '../../../public/aboutus/mobile/Adam-Jobson.webp'
import cindyMobile from '../../../public/aboutus/mobile/Cindy-Ripoll.webp'
import diyaMobile from '../../../public/aboutus/mobile/Diya-Afreen.webp'
import franMobile from '../../../public/aboutus/mobile/Francesca-Sequani.webp'
import harryMobile from '../../../public/aboutus/mobile/Harry-Mussotte.webp'
import leoMobile from '../../../public/aboutus/mobile/Leo-Sequani.webp'
import nicoleMobile from '../../../public/aboutus/mobile/Nicole-Cheer.webp'
import ramonMobile from '../../../public/aboutus/mobile/Ramon-Ripoll.webp'
import nicole from '../../../public/aboutus/Nicole-Cheer.webp'
import ramon from '../../../public/aboutus/Ramon-Ripoll.webp'
import billboard from '../../../public/carousel/Billboard.webp'
import ctaDesktop from '../../../public/growwithus/Cta-Desktop.webp'
import ctaMobile from '../../../public/growwithus/Cta-Mobile.webp'
import bus from '../../../public/carousel/Bus.webp'
import businessCards from '../../../public/carousel/Business-Cards2.webp'
import flyer from '../../../public/carousel/Flyer.webp'
import shirt from '../../../public/carousel/Shirt.webp'
import vjCta from '../../../public/carousel/VJ_CTA.webp'
import vjEcommerce from '../../../public/carousel/VJ-Ecommerce.webp'
import vajra from '../../../public/vajra.png'
import senftPlaceholder from '../../../public/whoweare/Senft-palceholder.webp'
import type { HomeContent, MediaDoc } from '@/lib/types'

// Fallback for the Pages "home" doc: getHome() drops back to this per-block when a block is missing
// or malformed, so an empty/unreachable database renders the page instead of failing the build.
// Static imports already carry dims + a generated blurDataURL, i.e. the same fields a Media doc
// has — so we adapt them to MediaDoc here and the components never learn where images came from.
const toMedia = (img: StaticImageData, alt: string): MediaDoc => ({
  url: img.src,
  width: img.width,
  height: img.height,
  blurDataURL: img.blurDataURL,
  alt,
})

export const home: HomeContent = {
  hero: {
    heading: 'Marketing you can follow.\nGrowth you can feel.',
    // no \n — body copy wraps to the viewport (the heading keeps its authored 2-line break)
    description:
      'Optimize your workflows, build your brand, and scale your business with a tech-forward in-house marketing team.',
    button: { label: "LET'S BEGIN" },
    slides: [
      toMedia(billboard, 'Billboard campaign'),
      toMedia(vjEcommerce, 'Vajra ecommerce site design'),
      toMedia(businessCards, 'Business card design'),
      toMedia(bus, 'Bus wrap advertising'),
      toMedia(shirt, 'Branded apparel'),
      toMedia(flyer, 'Print flyer design'),
      toMedia(vjCta, 'Vajra campaign creative'),
    ],
  },
  whoWeAre: {
    label: 'Who we are', // bare text — BracketLabel supplies the [ ] and uppercases it
    heading: 'Do you know where your\nmarketing dollars are going?',
    description:
      // blank line = paragraph break, same authored-newline convention as the headings
      "50% of Businesses Fail After Just 5 Years. The Culprit? Wasted Marketing Dollars.\n\nBut It Doesn't Have to Be That Way. This Could Be Us:",
    cards: [
      {
        image: toMedia(senftPlaceholder, 'Senft Legal billboard'),
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
        video: '/whoweare/vjbrand.mp4',
        title: 'Vajra Jahra',
        body: 'Vajra Jahra is a Costa Rica retreat center built in 2023. Vajra Jahra partnered with Laly in 2025, going from 0 bookings to 9. In 2026, Vajra Jahra has already increased revenue by 150% and is on track to be fully booked out for two full calendar years.',
        stat: { value: '150%', label: 'Revenue\nGrowth' },
        link: { label: 'EXPLORE' },
        bg: '#f3e8f2',
        border: '#716370',
        fg: '#443B43', // color/accent-2/5 — the card's ink (title, body, stat value)
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
      {
        title: 'The Power of\nTechnology',
        badges: [
          { label: 'Custom Code', color: '#A2A11C' },
          { label: 'API Integrations', color: '#F3E8F2' },
          { label: 'Advanced Forms', color: '#F5C882' },
        ],
        hook: 'If your marketing efforts feel disconnected from your business, this is for you.',
        body: 'We custom-build digital systems to help you track everything from where your budget is going to how your business is growing across all platforms.',
        link: { label: 'Explore technology' },
        fg: '#B5B449',
      },
    ],
  },
  about: {
    label: 'About us',
    heading: 'Your In-House\nMarketing Team.',
    description: 'Meet the friendly faces here to nurture your brand’s growth.',
    // Photos are final; `role` is placeholder copy until the real lines land.
    // `role` is the info-bar line; the \n is the authored 2-line break (rendered via whitespace-pre-line).
    members: [
      { photo: toMedia(cindy, 'Cindy Ripoll'), photoMobile: toMedia(cindyMobile, 'Cindy Ripoll'), name: 'Cindy Ripoll', role: 'The trusty team leader\nand your first point of contact.' },
      { photo: toMedia(adam, 'Adam Jobson'), photoMobile: toMedia(adamMobile, 'Adam Jobson'), name: 'Adam Jobson', role: 'Role line placeholder —\nsecond line of the blurb.' },
      { photo: toMedia(diya, 'Diya Afreen'), photoMobile: toMedia(diyaMobile, 'Diya Afreen'), name: 'Diya Afreen', role: 'Role line placeholder —\nsecond line of the blurb.' },
      { photo: toMedia(fran, 'Francesca Sequani'), photoMobile: toMedia(franMobile, 'Francesca Sequani'), name: 'Francesca Sequani', role: 'Role line placeholder —\nsecond line of the blurb.' },
      { photo: toMedia(harry, 'Harry Mussotte'), photoMobile: toMedia(harryMobile, 'Harry Mussotte'), name: 'Harry Mussotte', role: 'Role line placeholder —\nsecond line of the blurb.' },
      { photo: toMedia(leo, 'Leo Sequani'), photoMobile: toMedia(leoMobile, 'Leo Sequani'), name: 'Leo Sequani', role: 'Role line placeholder —\nsecond line of the blurb.' },
      { photo: toMedia(nicole, 'Nicole Cheer'), photoMobile: toMedia(nicoleMobile, 'Nicole Cheer'), name: 'Nicole Cheer', role: 'Role line placeholder —\nsecond line of the blurb.' },
      { photo: toMedia(ramon, 'Ramon Ripoll'), photoMobile: toMedia(ramonMobile, 'Ramon Ripoll'), name: 'Ramon Ripoll', role: 'Role line placeholder —\nsecond line of the blurb.' },
    ],
    story: { label: 'OUR STORY' },
  },
  contact: {
    label: 'Contact',
    heading: 'GROW\nWITH US.', // the break is the design; this one is display type, not body copy
    buttons: [{ label: "LET'S BEGIN" }, { label: 'BOOK A CALL' }],
    photo: toMedia(ctaDesktop, 'The Laly team'),
    photoMobile: toMedia(ctaMobile, 'The Laly team'),
    // ponytail: no hrefs yet — the real account URLs land with the Globals doc
    socials: [
      { platform: 'instagram' },
      { platform: 'tiktok' },
      { platform: 'youtube' },
      { platform: 'facebook' },
    ],
  },
  note: {
    // the break before the closing line is the design; the rest wraps to the container
    body: 'We’re looking for business owners who are passionate about nurturing their brand growth. As passionate as we are about our work, we can only provide services to a limited number of clients—that’s how we ensure every brand gets the attentive focus it deserves.\nGet in touch to be considered.',
  },
}
