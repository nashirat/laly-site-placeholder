import { Fragment, type ElementType } from 'react'

// Masked, per-letter slide-up reveal (karocrafts.com SplitText style) — pure CSS, so it's a server
// component AND fires at first paint (before JS), which keeps the whole hero cascade on one clock.
// The mask is per WORD, not per line: a word never wraps inside itself, so the reveal stays masked
// at any viewport (a line mask leaks once the line wraps). Chars still stagger across the full line.
// The `.char-rise` keyframe + reduced-motion opt-out live in styles.css.
export function TextReveal({
  lines,
  text,
  as: Tag = 'h2',
  className = '',
  delay = 0, // base offset (cascade position)
  stagger = 0.05, // seconds per char within a line
  lineDelay = 0.25, // offset added per line
}: {
  lines?: string[] // explicit lines
  text?: string // CMS convenience: one string, split on newlines into lines
  as?: ElementType
  className?: string
  delay?: number
  stagger?: number
  lineDelay?: number
}) {
  const rows = lines ?? (text ? text.split('\n').map((s) => s.trim()).filter(Boolean) : [])
  return (
    <Tag className={className} aria-label={rows.join(' ')}>
      {rows.map((line, li) => {
        let ci = 0 // char index resets per line, so each line staggers from its own start
        return (
          <span key={li} aria-hidden className="block">
            {line.split(' ').map((word, wi) => (
              <Fragment key={wi}>
                {wi > 0 && ' '}
                <span className="inline-block overflow-hidden">
                  {[...word].map((ch, i) => (
                    <span
                      key={i}
                      className="char-rise"
                      style={{ animationDelay: `${delay + li * lineDelay + ci++ * stagger}s` }}
                    >
                      {ch}
                    </span>
                  ))}
                </span>
              </Fragment>
            ))}
          </span>
        )
      })}
    </Tag>
  )
}
