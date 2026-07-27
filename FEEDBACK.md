# Client Feedback — Round N

Track: `[ ]` todo · `[x]` done · `[?]` blocked/needs asset

## 1. Hero — Mobile
`src/components/sections/Hero.tsx`
- [ ] Fix gap between elements (spacing off)
- [ ] Fix horizontal padding
- [ ] Reduce title font weight

## 2. Who We Are
`src/components/sections/WhoWeAre.tsx`
- [ ] Add border outline around images
- [ ] Split subheading text into lines per Figma

## 3. Strategy
`src/components/sections/Strategy.tsx`
- [ ] Mobile: move card button next to the title (differs from desktop layout)
- [ ] Hover: apply effect to whole card, not just button — refs/directions in Figma

## 4. About Us
`src/components/sections/About.tsx`
- [?] Images being resized by client — update once delivered
- [ ] Mobile: swap arrow icon next to "Scroll" for the desktop pixel arrow icon

## 5. Contact Us
`src/components/sections/Contact.tsx`
- [ ] Remove button hover effects on desktop

## 6. Typography & Colors — Global
Whole page. Consistency is the point — minimal page = less room for error.
- [ ] Audit all font sizes, colors, opacities vs Figma
- [ ] Mobile titles: 32px → 40px (where wrong)
- [ ] Mobile subheadings: 16px → 20px (where wrong)
- [ ] Mobile captions: 16px → 14px (spec changed)

## Open questions
- Figma link/frame for Strategy card hover refs?
- ETA on resized About Us images?
- Token values for `font/letter-spacing/*` — no Dev Mode, no API access on the file.
  Eyeballed: `xs` → -0.025em, `l` → 0. Ask designer to confirm the scale.
- Weight 450 (`55 Roman`) not shippable — only 400/500/700 woff2 in `src/fonts`.
  Using 400. Need a 450 file for exact match.
