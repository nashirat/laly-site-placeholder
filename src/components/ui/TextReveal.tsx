import type { ElementType } from 'react'

// Masked, per-letter slide-up reveal (karocrafts.com SplitText style) — pure CSS, so it's a server
// component AND fires at first paint (before JS). That keeps the hero from sitting blank while the
// page hydrates. The desc/button/carousel are JS-gated (they need it); the heading leads instantly.
// The `.char-rise` keyframe + reduced-motion opt-out live in styles.css.
export function TextReveal({
  lines,
  text,
  as: Tag = 'h2',
  className = '',
  stagger = 0.05, // seconds per char within a line
  lineDelay = 0.25, // base offset added per line
}: {
  lines?: string[] // explicit lines
  text?: string // CMS convenience: one string, split on newlines into lines
  as?: ElementType
  className?: string
  stagger?: number
  lineDelay?: number
}) {
  const rows = lines ?? (text ? text.split('\n').map((s) => s.trim()).filter(Boolean) : [])
  return (
    <Tag className={className} aria-label={rows.join(' ')}>
      {rows.map((line, li) => {
        let ci = 0 // char index resets per line, so each line staggers from its own start
        return (
          <span key={li} aria-hidden className="block overflow-hidden">
            {[...line].map((ch, i) => {
              if (ch === ' ') return ' '
              const delay = li * lineDelay + ci++ * stagger
              return (
                <span key={i} className="char-rise" style={{ animationDelay: `${delay}s` }}>
                  {ch}
                </span>
              )
            })}
          </span>
        )
      })}
    </Tag>
  )
}
