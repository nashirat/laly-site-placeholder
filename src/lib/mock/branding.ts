import type { BrandingContent } from '@/lib/types'

// Fallback for the Pages 'branding' doc — same contract as mock/paid.ts, and the same reason: the
// page prerenders at build time, so an empty or unreachable database has to render rather than fail
// the build. No CMS block backs it yet, so right now this is the only source; keep it byte-identical
// to whatever the seed script writes once one exists.
export const branding: BrandingContent = {
  // Figma 2724:3346
  hero: {
    label: 'Brand Visibility Services',
    heading: 'Be the name they think of first.',
    pills: ['Socials', 'SEO', 'OOH', 'Events'],
    description: {
      before:
        'We build a visibility system across search, social, and the physical world where every channel feeds the next. ',
      // set in Neue Haas bold at 24 against the 28px serif — a deliberate voice change mid-sentence,
      // hence its own field
      emphasis: 'The result:',
      after: ' your brand becomes the default choice before prospects ever need you.',
    },
    button: { label: 'LET’S BEGIN' },
  },
  // Figma 2724:4151. No \n here — one line that wraps, unlike paid's authored two-line break.
  positioning: {
    body: {
      before: 'Paid ads rent attention. ',
      emphasis: 'Brand owns it',
      after: '.',
    },
    // not in the Figma frame (it only draws the revealed state); the same prompt paid's cover uses
    scratchLabel: 'Scratch To Reveal',
  },
  // Figma 2767:9520
  system: {
    label: 'The System',
    heading: 'Three symbiotic channels that\nstrengthen each other.',
    body: {
      before:
        'Most agencies run SEO, social, and OOH as three disconnected operations.\n\n',
      emphasis:
        'We engineer them as a single system where every channel drives traffic to the others.',
      after:
        ' We carefully guide potential clients from seeing your billboard, to searching your name, to following your socials.\n\nBy the time they need you, their decision will have already been made.',
    },
    // back to front: Physical is the bottom of the stack, Search sits on top in full colour
    chain: [
      { title: 'Physical', blurb: 'They see you everywhere they go' },
      { title: 'Social', blurb: 'They trust you before they call' },
      {
        title: 'Search',
        blurb: { before: 'They ', emphasis: 'find', after: ' you when they need you' },
      },
    ],
  },
  // Figma 2796:9847. The section draws one slide (Search Visibility); Social and Physical are the
  // other two channels "The System" names, and their copy has not been handed over yet — the
  // carousel wraps on whatever it is given, so it renders correctly with one and with three.
  channels: {
    label: 'The Channels',
    heading: 'What each channel actually does for your firm.',
    slides: [
      {
        title: 'Search Visibility',
        lede: 'Organic leads that cost you $0 per click, every single month, compounding over time.',
        body: 'We optimize your entire web presence so Google treats you as the authority in your market. Every page we publish, every backlink we earn, every technical fix we implement keeps working for you—for months and years to come. This is the channel that makes your cost per lead drop over time instead of rising.',
        stats: [
          { value: '260%', label: 'Growth in legal SEO investment since 2017' },
          { value: '96%', label: 'Of people seeking legal help start with a search engine' },
        ],
        quote:
          '"The pages we built months ago are still generating calls today. That\'s the difference between renting leads and owning a pipeline."',
      },
    ],
  },
  // Figma 2767:9349 (desktop) / 2739:8985 (mobile) — all four phases, copy off the mobile frame,
  // which is where the designer wrote them out.
  compound: {
    label: 'The Compound Effect',
    heading: 'Every month\nbuilds on the last.',
    body: 'Branding is exponential. The SEO webpage published in month 1 is still generating leads in month 18. The billboard on someone’s morning commute triggers the Google search weeks later. The social post that builds trust today shortens the sales cycle six months from now.\n\nThe longer you run brand strategy, the cheaper each lead becomes and the less dependent you are on any single paid channel.',
    phases: [
      {
        period: 'Months 1–6',
        title: 'Foundation',
        body: 'Site optimization, content creation, social launch, OOH placements go live. Google begins indexing and recognizing your site. Brand awareness seeds planted.',
      },
      {
        period: 'Months 6–12',
        title: 'Traction',
        body: 'First organic rankings appear. Social engagement compounds. Brand name searches begin increasing. Direct leads start flowing from organic search.',
      },
      {
        period: 'Months 12–18',
        title: 'Momentum',
        body: 'Organic traffic rival paid ad volume. Cost per acquisition drops. Referrals increase with community recognition and social proof. Ad dependency decreases.',
      },
      {
        period: 'Year 2+',
        title: 'Dominance',
        body: 'Multi-channel acceleration in full effect. You own page one of search, the social media feed, and local recognition. Competitors can’t replicate 18 months of compounding in a single quarter.',
      },
    ],
  },
  // Figma 2796:9967. Identical to /paid-advertising's pricing block, copy included — kept as its own
  // values rather than an import of mock/paid so the two pages can diverge without a refactor.
  pricing: {
    label: 'Pricing',
    // the break after "Transparent." is authored, not a wrap
    heading: 'Simple. Transparent.\nPerformance-based.',
    tiers: [
      {
        label: 'One-time Setup',
        price: '$20,000',
        items: [
          'Business audit',
          'Custom Scaling Roadmap',
          'Full Website Build',
          'Campaign Architecture',
          'Tracking Infrastructure',
          'Call Handling Setup',
          'Reporting Dashboard',
        ],
      },
      {
        label: 'Per Qualified Lead',
        price: '$1,500',
        badge: 'PAY AS THEY COME IN',
        items: [
          'Only qualified leads that pass our filter and match the criteria we agreed on.',
          'You review every lead in your dashboard.',
          'Dispute any you disagree with.',
          'Pay as they come in.',
        ],
      },
    ],
    cta: { label: 'BOOK A CALL' },
  },
  // Figma 2724:3687.
  faq: {
    label: 'FAQ',
    heading: 'Frequently Asked Questions',
    // ponytail: the Figma FAQ is five lorem rows with one lorem answer — the copy has not been
    // written. Shipped verbatim rather than invented, so nobody mistakes filler for approved copy.
    items: Array.from({ length: 5 }, () => ({
      question: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit?',
      answer: 'This is subtext which appears after expanding the accordion.',
    })),
  },
  // Figma 2724:3711 — the same closing band /paid-advertising uses; only this line differs, and the
  // break after "brand" is the designer's.
  note: {
    body: 'You have revenue from ads. Now build the brand\nthat makes every future dollar cheaper to acquire.',
  },
}
