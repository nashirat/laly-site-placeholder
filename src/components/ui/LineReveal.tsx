import type { ElementType } from 'react'

// Per-line masked slide-up — pure CSS (server component, fires at first paint), so it shares the
// paint clock with the heading and the whole entry cascade stays aligned (no hydration offset).
// Lines are explicit (like the heading) — no JS line-measurement. .line-rise keyframe in styles.css.
// Each line's inner span is inline-block and centers via the inherited text-align.
export function LineReveal({
  lines,
  text,
  as: Tag = 'p',
  className = '',
  delay = 0, // base offset (cascade position)
  stagger = 0.2, // seconds between lines
}: {
  lines?: string[] // explicit lines
  text?: string // CMS convenience: one string split on newlines
  as?: ElementType
  className?: string
  delay?: number
  stagger?: number
}) {
  const rows = lines ?? (text ? text.split('\n').map((s) => s.trim()).filter(Boolean) : [])
  return (
    <Tag className={className} aria-label={rows.join(' ')}>
      {rows.map((line, i) => (
        <span key={i} aria-hidden className="block overflow-hidden">
          <span className="line-rise" style={{ animationDelay: `${delay + i * stagger}s` }}>
            {line}
          </span>
        </span>
      ))}
    </Tag>
  )
}
