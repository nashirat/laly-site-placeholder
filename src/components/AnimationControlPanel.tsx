'use client'

import { type CSSProperties, type PointerEvent, useEffect, useRef, useState } from 'react'

type HeadingMode = 'fade' | 'letters' | 'mix'
type SectionMode = 'media' | 'fadeup' | 'brackets'

const STORAGE_KEY = 'laly-animation-controls'
const POSITION_KEY = 'laly-animation-controls-position'
const HEADING_CLASSES = ['anim-heading-fade', 'anim-heading-letters', 'anim-heading-mix']
const SECTION_CLASSES = ['anim-sections-media', 'anim-sections-fadeup', 'anim-sections-brackets']

type AnimationControls = {
  version: 3
  heading: HeadingMode
  sections: SectionMode
}
type PanelPosition = {
  x: number
  y: number
}

const DEFAULTS: AnimationControls = {
  version: 3,
  heading: 'fade',
  sections: 'media',
}

function applyControls(controls: AnimationControls) {
  const root = document.documentElement
  root.classList.remove(...HEADING_CLASSES, ...SECTION_CLASSES)
  root.classList.add(`anim-heading-${controls.heading}`, `anim-sections-${controls.sections}`)
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...controls, version: 3 }))
}

function readControls(): AnimationControls {
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

function readPosition(): PanelPosition | null {
  try {
    const saved = JSON.parse(window.localStorage.getItem(POSITION_KEY) || 'null') as Partial<
      PanelPosition
    > | null
    if (typeof saved?.x !== 'number' || typeof saved?.y !== 'number') return null
    return { x: saved.x, y: saved.y }
  } catch {
    return null
  }
}

export function AnimationControlPanel() {
  const [controls, setControls] = useState<AnimationControls>(DEFAULTS)
  const [position, setPosition] = useState<PanelPosition | null>(null)
  const panelRef = useRef<HTMLDivElement>(null)
  const dragRef = useRef<{ offsetX: number; offsetY: number } | null>(null)
  const positionRef = useRef<PanelPosition | null>(null)

  useEffect(() => {
    const saved = readControls()
    setControls(saved)
    applyControls(saved)
    const savedPosition = readPosition()
    setPosition(savedPosition)
    positionRef.current = savedPosition
  }, [])

  useEffect(() => {
    const setPanelPosition = (next: PanelPosition) => {
      positionRef.current = next
      setPosition(next)
    }

    const onPointerMove = (e: globalThis.PointerEvent) => {
      const drag = dragRef.current
      const panel = panelRef.current
      if (!drag || !panel) return

      const rect = panel.getBoundingClientRect()
      const maxX = Math.max(0, window.innerWidth - rect.width)
      const maxY = Math.max(0, window.innerHeight - rect.height)
      setPanelPosition({
        x: Math.min(Math.max(0, e.clientX - drag.offsetX), maxX),
        y: Math.min(Math.max(0, e.clientY - drag.offsetY), maxY),
      })
    }

    const onPointerUp = () => {
      dragRef.current = null
      document.body.style.userSelect = ''
      const latest = positionRef.current
      if (latest) window.localStorage.setItem(POSITION_KEY, JSON.stringify(latest))
    }

    window.addEventListener('pointermove', onPointerMove)
    window.addEventListener('pointerup', onPointerUp)
    return () => {
      window.removeEventListener('pointermove', onPointerMove)
      window.removeEventListener('pointerup', onPointerUp)
    }
  }, [])

  const update = (next: AnimationControls) => {
    setControls(next)
    applyControls(next)
  }

  const refresh = () => {
    window.location.reload()
  }

  const startDrag = (e: PointerEvent<HTMLButtonElement>) => {
    if (e.button !== 0) return

    const rect = panelRef.current?.getBoundingClientRect()
    if (!rect) return

    const next = { x: rect.left, y: rect.top }
    positionRef.current = next
    setPosition(next)
    dragRef.current = {
      offsetX: e.clientX - rect.left,
      offsetY: e.clientY - rect.top,
    }
    document.body.style.userSelect = 'none'
  }

  const panelStyle = position
    ? ({ left: position.x, top: position.y } as CSSProperties)
    : undefined

  return (
    <div
      ref={panelRef}
      style={panelStyle}
      className={`fixed z-[110] flex flex-col gap-3 border border-[#262626]/15 bg-[#fffcf9]/95 p-3 font-mono text-[11px] uppercase text-[#262626] shadow-sm backdrop-blur ${
        position ? '' : 'bottom-4 left-4'
      }`}
    >
      <button
        type="button"
        className="cursor-grab border-b border-[#262626]/15 pb-2 text-left active:cursor-grabbing"
        onPointerDown={startDrag}
      >
        Animation
      </button>

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

      <button
        type="button"
        className="border border-[#262626]/20 px-2 py-1 text-left hover:bg-[#262626] hover:text-[#fffcf9]"
        onClick={refresh}
      >
        Refresh page
      </button>
    </div>
  )
}
