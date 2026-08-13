'use client'

import { useEffect, useRef, useState } from 'react'

// Scratch-off overlay. Sits absolutely over whatever the caller wants hidden: a canvas painted with
// the design's dark ground + noise, erased under the pointer with destination-out. Only what the
// pointer touches comes off — there is no completion threshold, so the panel never reveals itself.
//
// ponytail: this is magicui's scratch-to-reveal minus the dependencies. That component wants
// `motion` for one scale-pop, `clsx`/`tailwind-merge` for a `cn` this repo doesn't use, and a fixed
// width/height — the band is full-bleed, so the sizing was going to be rewritten regardless. Without
// the auto-reveal there is nothing left to measure either, so the alpha sampling went with it.
//
// The revealed copy is real DOM underneath and this whole layer is aria-hidden, so the section reads
// identically to a screen reader whether it has been scratched or not. Same reason reduced motion
// just never mounts the cover.

const COVER = '#292624' // color/neutral-variant/10 — the unscratched ground
const NOISE = 18 // ± per channel; the design's sub-hero-noise, radius 4
const BRUSH = 30 // scratch radius in CSS px

export function ScratchCover({ label }: { label: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [enabled, setEnabled] = useState(true)
  const [started, setStarted] = useState(false)
  // a ref, not state: it changes per pointermove and must not re-render the canvas out from under
  // the strokes already drawn on it
  const last = useRef<{ x: number; y: number } | null>(null)

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setEnabled(false)
      return
    }
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const paint = () => {
      // a repaint wipes every stroke, so once the user has started the stale bitmap just stretches.
      // Resizing mid-scratch is not a real session.
      if (last.current) return
      const rect = canvas.getBoundingClientRect()
      if (!rect.width || !rect.height) return
      // capped at 2: this is a noise field, not a photo
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      canvas.width = Math.round(rect.width * dpr)
      canvas.height = Math.round(rect.height * dpr)
      ctx.globalCompositeOperation = 'source-over'
      ctx.fillStyle = COVER
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      const img = ctx.getImageData(0, 0, canvas.width, canvas.height)
      const d = img.data
      for (let i = 0; i < d.length; i += 4) {
        const n = (Math.random() - 0.5) * NOISE
        d[i] += n
        d[i + 1] += n
        d[i + 2] += n
      }
      ctx.putImageData(img, 0, 0)
    }

    paint()
    // observe the parent: setting canvas.width doesn't change its CSS box, but observing the element
    // we resize is the kind of thing that turns into a loop the moment someone adds a style
    const target = canvas.parentElement ?? canvas
    const ro = new ResizeObserver(paint)
    ro.observe(target)
    return () => ro.disconnect()
  }, [])

  const scratch = (e: React.PointerEvent<HTMLCanvasElement>) => {
    // mouse only scratches while held; pen/touch only fire move while down anyway
    if (e.pointerType === 'mouse' && e.buttons !== 1) {
      last.current = null
      return
    }
    const canvas = canvasRef.current
    const ctx = canvas?.getContext('2d')
    if (!canvas || !ctx) return

    const rect = canvas.getBoundingClientRect()
    const dpr = canvas.width / rect.width
    const x = (e.clientX - rect.left) * dpr
    const y = (e.clientY - rect.top) * dpr

    ctx.globalCompositeOperation = 'destination-out'
    // a dot plus a line to the previous point: at speed the pointermoves are far enough apart that
    // dots alone leave a dotted trail instead of a stroke
    ctx.beginPath()
    ctx.arc(x, y, BRUSH * dpr, 0, Math.PI * 2)
    ctx.fill()
    if (last.current) {
      ctx.lineWidth = BRUSH * 2 * dpr
      ctx.lineCap = 'round'
      ctx.beginPath()
      ctx.moveTo(last.current.x, last.current.y)
      ctx.lineTo(x, y)
      ctx.stroke()
    }
    last.current = { x, y }
    if (!started) setStarted(true)
  }

  if (!enabled) return null

  return (
    <div aria-hidden className="absolute inset-0">
      <canvas
        ref={canvasRef}
        onPointerDown={(e) => {
          e.currentTarget.setPointerCapture(e.pointerId)
          last.current = null
          scratch(e)
        }}
        onPointerMove={scratch}
        // pan-y, not none: this is a full-bleed band on a scrolling page, so a vertical swipe has to
        // stay a scroll. Horizontal drag is the scratch.
        className="absolute inset-0 size-full cursor-crosshair touch-pan-y"
      />
      {/* the prompt rides on top of the cover and leaves on the first stroke — it has done its job by
          then, and it would otherwise sit over whatever gets uncovered */}
      <span
        // heading/h4: 18px mobile (2581:2758), 24 from md up
        className={`pointer-events-none absolute inset-0 flex items-center justify-center font-sans text-lg leading-[1.4] tracking-[-0.5px] text-[#BAA99E] transition-opacity duration-500 ease-out md:text-2xl ${
          started ? 'opacity-0' : 'opacity-100'
        }`}
      >
        {label}
      </span>
    </div>
  )
}
