# Strategy

**Every value is `mobile / desktop / wide`.**
mobile = under 768 · desktop = 768–1919 (what 1440 shows) · wide = 1920+ (ours, no Figma frame)
Edit numbers in place. `-` = not shown at that size. px unless marked %.

section
  padding top+bottom:  64 / 96 / 128
  side padding:        20
  max width:           1360 / 1360 / 1560
  background:          #292624

"[ STRATEGY ]"
  size:            14 / 24 / 24
  weight:          400
  leading:         140%
  letter-spacing:  0.2em
  color:           #ff6d6a

"How we help you grow."
  size:            40 / 72 / 72     (60 between 768–1279)
  weight:          400
  leading:         100%
  color:           #fffcf9

"You don't need to spend more—you need to spend smarter."
  size:            20 / 28 / 28     (24 between 768–1279)
  weight:          400
  leading:         125%
  color:           #B5ADA7
  max width:       460 / 460 / 560

gaps
  caption → heading:       20 / 32 / 32
  heading → desc:          24 / 24 / 24
  desc → cards:            40 / 56 / 80
  card → card:             24 / 24 / 32
  card min-height:         - / 400 / 460

---

## card ("The Power of Paid Advertisement", etc.)

card
  padding sides:       16 / 16 / 24
  padding top+bottom:  24 / 24 / 32
  background:          #151414 at 32%
  layout:              1 column  /  3 across

"The Power of Paid Advertisement"
  size:            32 / 44 / 52
  weight:          400
  leading:         110%
  color:           #E5CBE2 / #DFA854 / #B5B449  (card 1 / 2 / 3)

badge "Social Media Strategy"
  text size:       12 / 12 / 12
  leading:         125%
  text color:      #FCF7F3
  fill:            #2D2A28
  padding:         10 sides / 4 top+bottom
  pill height:     23 (hugs the text)
  star icon:       9 × 10
  gap star → text: 4
  gap badge → badge: 8
  wrapping:        wraps to 2 lines  /  never wraps, scrolls sideways

"If you're looking for a new stream of high-quality leads, this is for you."
  size:            18 / 24 / 24     (20 between 768–1279)
  weight:          400
  leading:         125%
  color:           #FCF7F3

"Pay for website traffic that translates to a reliable stream…"
  size:            14 / 16 / 18
  weight:          400
  leading:         125%
  color:           #D1C1B7
  font:            Neue Haas (every other body line is New Spirit)

arrow button
  size:            32 / 40 / 40
  sits next to:    the title  /  the hook line
  color:           #D1C1B7
  gap to its neighbour:  16

gaps inside the card
  title → badges:          24 / 24 / 28
  badges → hook:           32 / 32 / 36
  hook → body:             32 / 32 / 36   (desktop pins the body to the card bottom)
