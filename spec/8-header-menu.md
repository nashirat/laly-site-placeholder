# Header / Menu

**Every value is `mobile / desktop / wide`.**
mobile = under 768 · desktop = 768–1919 (what 1440 shows) · wide = 1920+ (ours, no Figma frame)
Edit numbers in place. `-` = not shown at that size. px unless marked %.

bar
  height:          76
  side padding:    20
  background:      #fffcf9
  logo:            120 × 28

button "MENU" / "CLOSE"
  label size:      16 / 16 / 18
  padding:         8 sides / 6 top+bottom
  keyline:         0.5, #262626
  swap:            label masks up to CLOSE on open, drops back on close

menu items "ABOUT", "CASE STUDIES", "SERVICES", "CONTACT"
  size:            16 / 16 / 18
  weight:          500
  pill padding:    12 sides / 6 top+bottom
  pill fill:       #fffcf9
  gap item → item: 4
  gap to the button above: 16
  alignment:       right
