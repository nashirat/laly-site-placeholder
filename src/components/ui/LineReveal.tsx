import { Fragment, type ElementType } from 'react'

// Masked slide-up reveal for body copy — pure CSS (server component, fires at first paint), so it
// shares the paint clock with the heading and the entry cascade stays aligned (no hydration offset).
//
// Text wraps naturally: no explicit line breaks, because a hard break authored for one viewport
// orphans words on every other one. Each WORD is its own mask (a word never wraps inside itself, so
// the reveal stays masked at any width) and staggers by word index. Since wrapping puts later words
// on later rows, the stagger reads as a rise flowing down the paragraph — the per-line feel, without
// the JS line-measurement that would drag this onto the hydration clock.
// .line-rise keyframe in styles.css.
export function LineReveal({
  text,
  as: Tag = 'p',
  className = '',
  delay = 0, // base offset (cascade position)
  stagger = 0, // seconds between words. 0 = the paragraph rises as one — the default, matching
  // TextReveal: the word-by-word wave is a hero flourish, not a house style. Hero opts in.
}: {
  text: string
  as?: ElementType
  className?: string
  delay?: number
  stagger?: number
}) {
  const words = text.split(/\s+/).filter(Boolean)
  return (
    <Tag className={className} aria-label={text}>
      {words.map((word, i) => (
        <Fragment key={i}>
          {i > 0 && ' '}
          <span aria-hidden className="inline-block overflow-hidden">
            <span className="line-rise" style={{ animationDelay: `${delay + i * stagger}s` }}>
              {word}
            </span>
          </span>
        </Fragment>
      ))}
    </Tag>
  )
}
