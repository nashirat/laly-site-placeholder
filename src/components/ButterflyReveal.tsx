'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { Canvas } from '@react-three/fiber'
import { ButterflyScene, FILL } from '@/components/canvas/ButterflyScene'
import { getLenis } from '@/lib/lenis'

// Full-screen entry curtain, replacing the pink slide-up preloader. Hosts the R3F canvas and owns
// everything that is not the scene: the scroll it takes off the page, the progress it hands the
// shader, and the copy that rides on top. ButterflyScene owns the visuals.
//
// The hole opens from a dot into the butterfly, then scrolling flies the camera through it:
//   uShapeReveal    0 -> 1    dot -> butterfly morph, on a clock, once the mask is baked
//   uPulseReveal    0 -> 1 -> 0  bloom over the back half of that morph
//   uScrollProgress 0 -> 1    barrel warp + zoom past the hole, driven by scroll
//
// It sets `preloader-done` on <html> immediately, because the hero entry animations in styles.css are
// gated on that class — the site underneath stays in its normal revealed state while this is up.

// Viewport heights of scroll travel that take uScrollProgress 0 -> 1. The page is frozen for all of
// it, so this is pure gesture distance, not distance moved. Raise it to make the whole reveal cost
// more scroll — the zoom stretches out and the layer lives longer before it drops.
const REVEAL_TRAVEL = 2.6
// Exponential smoothing rate for the same, in 1/s. Podium lerps at .08/frame; at 60fps that is this.
const SCROLL_LERP = 5

export function ButterflyReveal() {
  const overlayRef = useRef<HTMLDivElement>(null)
  const progress = useRef(0)
  const [ready, setReady] = useState(false)
  const [done, setDone] = useState(false)

  // Identity has to be stable: it is a dep of the scene's one-shot shape load.
  const onReady = useCallback(() => setReady(true), [])

  useEffect(() => {
    // No entrance to gate on any more, so release the site immediately.
    const root = document.documentElement
    root.classList.remove('preloading', 'preloading-done')
    root.classList.add('preloader-done')

    // The curtain takes the scroll — the site underneath must not move until the butterfly has been
    // flown through.
    //
    // The freeze is `overflow: clip` on <html>, not Lenis. Lenis is the obvious tool (CompoundEffect
    // stops it to pin its phases) but it cannot be the whole answer here: SmoothScroll publishes the
    // instance from an effect, this component mounts at first paint, and whoever loses that race
    // leaves the page scrollable for the frames in between. A non-scrollable document has no race —
    // Lenis writes real scrollTop, and a clipped root has nowhere to write it to. It also covers the
    // keyboard and the scrollbar, which a stopped Lenis does not.
    //
    // Lenis is still stopped when we can reach it, so it is not animating against a wall the whole
    // time, and start() resets it on the way out. If it is null the clip alone holds the page.
    //
    // Deltas come off plain wheel/touch listeners rather than Lenis' `virtual-scroll` for the same
    // reason: no instance to subscribe to on frame one. Passive — nothing to preventDefault, the clip
    // already did it.
    let travel = 0
    const onWheel = (e: WheelEvent) => {
      travel = Math.max(0, travel + e.deltaY)
    }
    let touchY = 0
    const onTouchStart = (e: TouchEvent) => {
      touchY = e.touches[0]?.clientY ?? 0
    }
    const onTouchMove = (e: TouchEvent) => {
      const y = e.touches[0]?.clientY ?? touchY
      travel = Math.max(0, travel + (touchY - y) * 2) // a drag covers less distance than a wheel
      touchY = y
    }

    // Under prefers-reduced-motion Lenis is never constructed, and freezing the page is exactly the
    // kind of motion that setting is asking us not to do. The reveal rides real scroll position and
    // the page is never held.
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    let held = false

    if (!reduced) {
      held = true
      root.style.overflow = 'clip'
      window.addEventListener('wheel', onWheel, { passive: true })
      window.addEventListener('touchstart', onTouchStart, { passive: true })
      window.addEventListener('touchmove', onTouchMove, { passive: true })
      getLenis()?.stop()
    }

    const releaseScroll = () => {
      if (!held) return
      held = false
      root.style.removeProperty('overflow')
      window.removeEventListener('wheel', onWheel)
      window.removeEventListener('touchstart', onTouchStart)
      window.removeEventListener('touchmove', onTouchMove)
      // start() runs Lenis' own reset, so it picks up scrollTop rather than resuming toward a target
      // it computed before the page was clipped. Called even if stop() never landed — it no-ops.
      getLenis()?.start()
    }

    const scrolled = () =>
      Math.min(
        reduced
          ? window.scrollY / window.innerHeight
          : travel / (window.innerHeight * REVEAL_TRAVEL),
        1,
      )

    // The lerp lives here rather than in a useFrame so it keeps running while the scene is still
    // loading its shape, and so the release below cannot be starved by a stalled render loop.
    let raf = 0
    let last = performance.now()
    // Latch. `done` makes this component render null, but rendering null is not unmounting — the
    // effect below has no deps, so it never tears down, and without this the loop keeps calling
    // setDone every frame forever. React counts those as nested updates and throws past 50.
    let finished = false
    const tick = (now: number) => {
      raf = requestAnimationFrame(tick)
      const dt = Math.min((now - last) / 1000, 0.05)
      last = now

      // Frame-rate independent lerp, so 120Hz matches 60Hz instead of arriving twice as fast.
      progress.current += (scrolled() - progress.current) * (1 - Math.exp(-dt * SCROLL_LERP))
      const p = progress.current

      // Copy goes first — it belongs to the curtain, and lingering over the exposed site reads as a
      // bug. Gone by a third of the way in, well before the shape starts to open out.
      const overlay = overlayRef.current
      if (overlay) overlay.style.opacity = String(Math.max(0, 1 - p * 3))

      // The lerp only approaches 1, and everything is already invisible before it gets there. Hand
      // the scroll back and drop the layer — no reason to keep a canvas and a GL context alive over a
      // site you can already see. One-shot: scrolling back up does not put it back, which would
      // freeze the page again under someone who has finished with it.
      if (p > 0.995 && !finished) {
        finished = true
        cancelAnimationFrame(raf)
        releaseScroll()
        setDone(true)
      }
    }
    raf = requestAnimationFrame(tick)

    return () => {
      cancelAnimationFrame(raf)
      // never leave the page frozen behind us
      releaseScroll()
    }
  }, [])

  if (done) return null

  return (
    <div className="pointer-events-none fixed inset-0 z-[100]">
      {/* Covers the page from first paint, while the shape rasterises and the scene compiles. Without
          it the site would show for those frames before the curtain dropped over it. Goes the moment
          the curtain can draw its own fill, or it would show through the hole the shader punches. */}
      {!ready && <div className="absolute inset-0" style={{ background: FILL }} />}
      <Canvas
        flat
        dpr={[1, 2]}
        gl={{ alpha: true, antialias: true }}
        camera={{ position: [0, 0, 5], fov: 50 }}
        style={{ position: 'absolute', inset: 0 }}
      >
        <ButterflyScene progress={progress} onReady={onReady} />
      </Canvas>
      {/* Copy sits on the curtain, above the canvas — black on the pink, the way podium runs black on
          their beige. Placeholder text for now. Padding matches the real header (px-5 sm:px-10, h-19)
          so the logo lands exactly where the site's own logo will be when the curtain clears. */}
      <div ref={overlayRef} aria-hidden className="absolute inset-0 text-black">
        <div className="flex h-19 items-center justify-between px-5 sm:px-10">
          <img src="/blacklogo.png" alt="" width={120} height={28} className="h-7 w-30" />
          <p className="font-display text-xl leading-none tracking-[-0.02em] sm:text-2xl">
            Lorem Ipsum
          </p>
        </div>
        <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-8 px-5 pb-5 sm:px-10 sm:pb-10">
          <p className="font-display max-w-[14ch] text-3xl leading-[0.95] tracking-[-0.02em] sm:text-5xl">
            Lorem ipsum dolor sit
          </p>
          <p className="font-display shrink-0 text-xl leading-none tracking-[-0.02em] sm:text-2xl">
            Scroll Down
          </p>
        </div>
      </div>
    </div>
  )
}
