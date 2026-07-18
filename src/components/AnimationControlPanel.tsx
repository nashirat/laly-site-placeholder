'use client'

import { useEffect, useState } from 'react'

type HeadingMode = 'fade' | 'letters' | 'mix'
type SectionMode = 'media' | 'fadeup' | 'brackets'

const STORAGE_KEY = 'laly-animation-controls'
const HEADING_CLASSES = ['anim-heading-fade', 'anim-heading-letters', 'anim-heading-mix']
const SECTION_CLASSES = ['anim-sections-media', 'anim-sections-fadeup', 'anim-sections-brackets']

type AnimationControls = {
  version: 3
  heading: HeadingMode
  sections: SectionMode
}

const DEFAULTS: AnimationControls = {
  version: 3,
  heading: 'fade',
  sections: 'media',
}

function applyControls(controls: AnimationControls) {
  if (process.env.NODE_ENV !== 'development') return

  const root = document.documentElement
  root.classList.remove(...HEADING_CLASSES, ...SECTION_CLASSES)
  root.classList.add(`anim-heading-${controls.heading}`, `anim-sections-${controls.sections}`)
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...controls, version: 3 }))
}

function readControls(): AnimationControls {
  if (process.env.NODE_ENV !== 'development') return DEFAULTS

  try {
    const saved = JSON.parse(window.localStorage.getItem(STORAGE_KEY) || 'null') as Partial<
      AnimationControls
    > | null
    if (saved?.version !== 3) return DEFAULTS

    return {
      version: 3,
      heading:
        saved?.heading === 'letters' || saved?.heading === 'mix' ? saved.heading : DEFAULTS.heading,
      sections:
        saved?.sections === 'fadeup' || saved?.sections === 'brackets'
          ? saved.sections
          : DEFAULTS.sections,
    }
  } catch {
    return DEFAULTS
  }
}

export function AnimationControlPanel() {
  const [controls, setControls] = useState<AnimationControls>(DEFAULTS)

  useEffect(() => {
    const saved = readControls()
    setControls(saved)
    applyControls(saved)
  }, [])

  const update = (next: AnimationControls) => {
    setControls(next)
    applyControls(next)
  }

  if (process.env.NODE_ENV !== 'development') return null

  return (
    <div className="fixed bottom-4 left-4 z-[110] flex flex-col gap-3 border border-[#262626]/15 bg-[#fffcf9]/95 p-3 font-mono text-[11px] uppercase text-[#262626] shadow-sm backdrop-blur">
      <label className="flex items-center justify-between gap-4">
        <span>Heading</span>
        <select
          className="border border-[#262626]/20 bg-transparent px-2 py-1"
          value={controls.heading}
          onChange={(e) => update({ ...controls, heading: e.target.value as HeadingMode })}
        >
          <option value="fade">Fade up</option>
          <option value="letters">Letters</option>
          <option value="mix">Mix</option>
        </select>
      </label>

      <label className="flex items-center justify-between gap-4">
        <span>Sections</span>
        <select
          className="border border-[#262626]/20 bg-transparent px-2 py-1"
          value={controls.sections}
          onChange={(e) => update({ ...controls, sections: e.target.value as SectionMode })}
        >
          <option value="media">Bracket + media</option>
          <option value="fadeup">Fade up</option>
          <option value="brackets">Brackets only</option>
        </select>
      </label>
    </div>
  )
}
