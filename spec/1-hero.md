# Hero

**Every value is `mobile / desktop / wide`.**
mobile = under 768 · desktop = 768–1919 (what 1440 shows) · wide = 1920+ (ours, no Figma frame)
Edit numbers in place. `-` = not shown at that size. px unless marked %.

section
  height:          hugs content (~808 at the design's width)
  padding top:     156 / 124 / 124   (navbar 76 + Figma gap 80 mobile / 48 desktop)
  padding bottom:  48 / 112 / 112
  padding sides:   20 / 48 / 48
  border bottom:   1, #544D49
  background:      #fffcf9

text container
  max width:       291 / 1056 / 1200

"Marketing you can follow. / Growth you can feel."
  size:            44 / 72 / 96
  weight:          450 (400 if 450 doesnt exist) / 500 / 500
  leading:         110% / 100% / 100%
  letter-spacing:  -0.025em
  color:           #262626

"Optimize your workflows, build your brand, and scale your business…"
  size:            18 / 28 / 30
  weight:          400
  leading:         125%
  color:           #4A4A4A
  max width:       616 / 616 / 800

button "LET'S BEGIN"
  label size:      16 / 20 / 20
  padding:         8 sides / 6 top+bottom
  fill:            #ff6d6a
  label color:     #292624

image strip
  image height:    250 / 340 / 476
  gap:             12 / 12 / 24
  right edge:      no padding — runs off screen, never cut

gaps
  heading → desc:          20 / 24 / 24
  desc → button:           20 / 24 / 24
  button → image strip:    56 / 48 / 64
