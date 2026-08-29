'use client'

import { useEffect, useRef, useState } from 'react'

// Full-screen WebGL curtain, replacing the pink slide-up preloader. One quad, one fragment shader,
// no three.js: the shape is a hole punched out of a solid fill, so you look *through* the curtain at
// the real DOM site underneath. Sequence is dot -> butterfly -> fly-through -> unmount.
//
// NO ANIMATION YET — this is the mouse interaction on its own, so the shape can be tuned in
// isolation. The layer goes up and stays up: the butterfly hole is fully open from the first frame
// and the only thing moving is the fluid trail under the cursor.
//
// The three animation uniforms are wired but pinned to constants (see PINNED below). Driving them is
// the whole of the animation work:
//   uShapeReveal    0 -> 1   dot morphs into the butterfly (entrance)
//   uPulseReveal    0 -> 1   bloom on the last frames of that morph
//   uScrollProgress 0 -> 1   barrel warp + zoom-through + fade, i.e. the reveal
//
// It sets `preloader-done` on <html> immediately, because the hero entry animations in styles.css are
// gated on that class — the site underneath stays in its normal revealed state while this is up.
const SHAPE_SIZE = 512 // shape mask resolution (POT)
const TRAIL_SIZE = 512 // mouse trail resolution (POT)
const SHAPE_BLUR = 10 // px of blur baked into the mask; widens the band the fluid trail can wobble
const SHAPE_INSET = 0.62 // butterfly occupies this fraction of the square, leaving room for the blur
// Half-width of the antialiased edge, in mask-value units. Coupled to SHAPE_BLUR: the blur decides how
// fast the mask ramps 0 -> 1 across the outline, and this decides how much of that ramp reads as soft
// edge. Podium can use ~0.003 because their mask is a real baked SDF that ramps slowly; a blurred
// bitmap ramps far steeper, and that band would land inside a single pixel — hard, jagged, and it
// turns the trail displacement into binary noise instead of a wobble. Widen SHAPE_BLUR and this
// together for a softer outline.
const EDGE_SOFTNESS = 0.06
const FILL = '#ff6d6a' // same pink the old curtain used

// Values lifted from podium.global's hero config — they are already tuned, no reason to re-derive.
const CFG = {
  fluidIntensity: 0.6,
  noiseIntensity: 0.6,
  barrelIntensity: 6,
  uvScale: 0.85, // shape covers ~SHAPE_INSET/uvScale of the viewport's short side, so ~73%
  pulseMult: 0.2,
}

const VERT = `
attribute vec2 position;
varying vec2 vUv;
void main() {
  vUv = position * 0.5 + 0.5;
  gl_Position = vec4(position, 0.0, 1.0);
}
`

const FRAG = `
precision highp float;

uniform float uShapeReveal;
uniform float uScrollProgress;
uniform float uPulseReveal;
uniform sampler2D uShapeTexture;
uniform sampler2D uMouseTexture;
uniform vec2 uMeshSize;
uniform vec3 uColor;
varying vec2 vUv;

float hash(vec2 p) {
  return fract(1e4 * sin(17.0 * p.x + p.y * 0.1) * (0.1 + abs(sin(p.y * 13.0 + p.x))));
}

float noise(vec2 x) {
  vec2 i = floor(x);
  vec2 f = fract(x);
  float a = hash(i);
  float b = hash(i + vec2(1.0, 0.0));
  float c = hash(i + vec2(0.0, 1.0));
  float d = hash(i + vec2(1.0, 1.0));
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(a, b, u.x) + (c - a) * u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
}

vec2 barrelPincushion(vec2 uv, float strength) {
  vec2 st = uv - 0.5;
  float radius = 1.0 + strength * dot(st, st);
  return 0.5 + radius * st;
}

float sdCircle(in vec2 p, in float r) {
  return length(p) - r;
}

void main() {
  float meshRatio = uMeshSize.x / uMeshSize.y;

  float pulse = uPulseReveal * ${CFG.pulseMult.toFixed(3)};

  // Shrinking the UV about centre scales the shape up; at the end of the outro it has grown past the
  // viewport, the fill is gone, and the site is fully exposed. This stands in for podium moving the
  // mesh toward the camera — same read, no camera needed.
  float zoom = mix(1.0, 0.02, pow(uScrollProgress, 2.0));
  vec2 uv = (vUv - 0.5) * (${CFG.uvScale.toFixed(3)} - pulse) * zoom + 0.5;
  vec2 uvBarrel = barrelPincushion(uv, -uScrollProgress * ${CFG.barrelIntensity.toFixed(3)});

  // Square mask on a non-square viewport: stretch the long axis so the butterfly stays a butterfly.
  if (meshRatio > 1.0) {
    uvBarrel.x = (uvBarrel.x - 0.5) * meshRatio + 0.5;
  } else {
    uvBarrel.y = (uvBarrel.y - 0.5) / meshRatio + 0.5;
  }

  // Trail displacement, faded out by scroll so it stops fighting the fly-through.
  float fnoise = pow(1.0 - uScrollProgress, 4.0) * noise(uvBarrel * 1000.0) * ${CFG.noiseIntensity.toFixed(3)};
  vec3 mouseColor = texture2D(uMouseTexture, vUv).rgb * fnoise;
  vec2 uvMouseTrail = uvBarrel - mouseColor.rg * ${CFG.fluidIntensity.toFixed(3)};

  vec2 shapeUv = uvMouseTrail;
  shapeUv.y = 1.0 - shapeUv.y;

  // The mask is drawn white-on-black and blurred, so the green channel reads as a crude distance
  // field: >0.5 inside the butterfly, <0.5 outside, with a soft band on the boundary.
  vec3 shapeMap = texture2D(uShapeTexture, shapeUv).rgb;

  vec2 circleUv = vUv - 0.5;
  circleUv.x *= meshRatio;
  float sdf_circle = sdCircle(circleUv, 0.01);
  float sdf_texture = 0.5 - shapeMap.g;

  // The morph: a dot at uShapeReveal 0, the butterfly at 1.
  float sdf_final = mix(sdf_texture, sdf_circle, 1.0 - uShapeReveal);

  // Keep the trail from chewing the outline while the dot is still opening up.
  float edgeGuard = smoothstep(0.0, 0.05, abs(sdf_final));
  sdf_final = mix(sdf_final, mix(mix(sdf_texture, sdf_final, edgeGuard), sdf_final, edgeGuard), uShapeReveal);

  // The dot is a true SDF and wants a tight band; the blurred butterfly bitmap wants a wide one. Lerp
  // between them on the morph so both phases are antialiased correctly.
  float band = mix(0.003, ${EDGE_SOFTNESS.toFixed(3)}, uShapeReveal);
  float mask = smoothstep(-band, band, sdf_final);

  // Bloom on the last frames of the morph. The pow lives inside the mix so it is inert at rest —
  // applied to mask directly (as podium does) it would crush the soft edge above and bloat the fill
  // inward, because their tight band is near-binary already and ours deliberately is not.
  float mask_scale_and_blur = length(circleUv) + smoothstep(-1.0, 1.0, sdf_final) + 0.3;
  mask = mix(mask, pow(mask_scale_and_blur, 4.0), uPulseReveal);

  // The bloom term above keeps the screen corners opaque no matter how far the shape is zoomed, so
  // the zoom alone never clears the curtain — podium's plane physically leaves the frustum, ours
  // cannot. Fade the whole layer over the back half of the outro so it reliably reaches zero.
  float fade = 1.0 - smoothstep(0.6, 1.0, uScrollProgress);
  gl_FragColor = vec4(uColor, clamp(mask, 0.0, 1.0) * fade);
}
`

// Radial-gradient blobs painted into a 2D canvas and aged out — the "fluid" trail is not a fluid sim,
// it is this. Ported from podium.global, whose numbers are already tuned.
class TouchTexture {
  canvas: HTMLCanvasElement
  ctx: CanvasRenderingContext2D
  trail: { x: number; y: number; age: number; force: number }[] = []
  force = 0
  size = TRAIL_SIZE
  maxAge = 600
  radius = 0.095
  intensity = 0.1
  minForce = 0.5

  constructor() {
    this.canvas = document.createElement('canvas')
    this.canvas.width = this.canvas.height = this.size
    this.ctx = this.canvas.getContext('2d')!
    this.clear()
  }

  clear() {
    this.ctx.globalCompositeOperation = 'source-over'
    this.ctx.fillStyle = 'black'
    this.ctx.fillRect(0, 0, this.size, this.size)
  }

  // uv is bottom-left origin, matching the shader.
  addTouch(x: number, y: number) {
    const last = this.trail[this.trail.length - 1]
    if (last) {
      const dx = last.x - x
      const dy = last.y - y
      this.force = Math.max(this.minForce, Math.min((dx * dx + dy * dy) * 1e4, 1))
    }
    this.trail.push({ x, y, age: 0, force: this.force })
  }

  update(dt: number) {
    this.clear()
    this.trail = this.trail.filter((p) => (p.age += dt * 1000) <= this.maxAge)
    if (!this.trail.length) this.force = 0
    for (const p of this.trail) this.draw(p)
  }

  private draw(p: { x: number; y: number; age: number; force: number }) {
    const ease = (t: number) => Math.sqrt(1 - (t - 1) ** 2)
    const t = p.age / this.maxAge
    const alpha = (t < 0.3 ? ease(t / 0.3) : ease(1 - (t - 0.3) / 0.7)) * p.force
    const x = p.x * this.size
    const y = (1 - p.y) * this.size
    const r = Math.max(0, this.size * this.radius * alpha)
    const g = this.ctx.createRadialGradient(x, y, r * 0.25, x, y, r)
    g.addColorStop(0, `rgba(255,255,255,${this.intensity})`)
    g.addColorStop(1, 'rgba(0,0,0,0)')
    this.ctx.globalCompositeOperation = 'difference'
    this.ctx.fillStyle = g
    this.ctx.beginPath()
    this.ctx.arc(x, y, r, 0, Math.PI * 2)
    this.ctx.fill()
  }
}

// Rasterise /butterfly.svg into a blurred white-on-black square. Done at runtime rather than baked at
// build time so swapping the shape is just swapping the file — it costs one 512x512 canvas, once.
function loadShapeCanvas(): Promise<HTMLCanvasElement> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.onload = () => {
      const d = SHAPE_SIZE * SHAPE_INSET
      const o = (SHAPE_SIZE - d) / 2

      // The source art is pink on transparent, but the shader thresholds the green channel at 0.5, so
      // the shape has to be white. Recolour through the alpha channel rather than shipping a second
      // white copy of the SVG — one file, nothing to keep in sync.
      const tmp = document.createElement('canvas')
      tmp.width = tmp.height = SHAPE_SIZE
      const tctx = tmp.getContext('2d')!
      tctx.filter = `blur(${SHAPE_BLUR}px)`
      tctx.drawImage(img, o, o, d, d)
      tctx.filter = 'none'
      tctx.globalCompositeOperation = 'source-in'
      tctx.fillStyle = 'white'
      tctx.fillRect(0, 0, SHAPE_SIZE, SHAPE_SIZE)

      const c = document.createElement('canvas')
      c.width = c.height = SHAPE_SIZE
      const ctx = c.getContext('2d')!
      ctx.fillStyle = 'black'
      ctx.fillRect(0, 0, SHAPE_SIZE, SHAPE_SIZE)
      ctx.drawImage(tmp, 0, 0)
      resolve(c)
    }
    img.onerror = reject
    img.src = '/butterfly.svg'
  })
}
export function ButterflyReveal() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [failed, setFailed] = useState(false)

  useEffect(() => {
    // No entrance to gate on any more, so release the site immediately.
    const root = document.documentElement
    root.classList.remove('preloading', 'preloading-done')
    root.classList.add('preloader-done')

    const canvas = canvasRef.current
    if (!canvas) return
    // No WebGL means no hole to look through, and the fill would sit there opaque over the whole
    // site. Drop the layer instead — no effect beats a covered site.
    const gl = canvas.getContext('webgl', { alpha: true, premultipliedAlpha: false, antialias: true })
    if (!gl) {
      setFailed(true)
      return
    }

    const compile = (type: number, src: string) => {
      const s = gl.createShader(type)!
      gl.shaderSource(s, src)
      gl.compileShader(s)
      if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(s) ?? 'shader')
      return s
    }

    const program = gl.createProgram()!
    try {
      gl.attachShader(program, compile(gl.VERTEX_SHADER, VERT))
      gl.attachShader(program, compile(gl.FRAGMENT_SHADER, FRAG))
      gl.linkProgram(program)
      if (!gl.getProgramParameter(program, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(program) ?? 'link')
      gl.useProgram(program)
    } catch (err) {
      console.error('[ButterflyReveal]', err)
      setFailed(true)
      return
    }

    const buf = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, buf)
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW)
    const loc = gl.getAttribLocation(program, 'position')
    gl.enableVertexAttribArray(loc)
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0)

    const u = (n: string) => gl.getUniformLocation(program, n)
    const uMeshSize = u('uMeshSize')

    // PINNED — the animation uniforms, set once. Shape fully open, no bloom, no scroll.
    gl.uniform1f(u('uShapeReveal'), 1)
    gl.uniform1f(u('uPulseReveal'), 0)
    gl.uniform1f(u('uScrollProgress'), 0)

    const makeTexture = (unit: number) => {
      const t = gl.createTexture()
      gl.activeTexture(gl.TEXTURE0 + unit)
      gl.bindTexture(gl.TEXTURE_2D, t)
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR)
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR)
      return t
    }
    const shapeTex = makeTexture(0)
    const trailTex = makeTexture(1)
    gl.uniform1i(u('uShapeTexture'), 0)
    gl.uniform1i(u('uMouseTexture'), 1)

    // UNPACK_FLIP_Y_WEBGL is global GL state, not per-texture, so it is set on every upload. The shape
    // stays unflipped because the shader flips it explicitly; the trail is flipped so its canvas
    // (top-left origin) lines up with vUv (bottom-left).
    const upload = (unit: number, tex: WebGLTexture | null, src: TexImageSource, flipY: boolean) => {
      gl.activeTexture(gl.TEXTURE0 + unit)
      gl.bindTexture(gl.TEXTURE_2D, tex)
      gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, flipY ? 1 : 0)
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, src)
    }

    const [r, g, b] = [1, 3, 5].map((i) => parseInt(FILL.slice(i, i + 2), 16) / 255)
    gl.uniform3f(u('uColor'), r, g, b)
    gl.enable(gl.BLEND)
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA)

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      canvas.width = Math.round(window.innerWidth * dpr)
      canvas.height = Math.round(window.innerHeight * dpr)
      gl.viewport(0, 0, canvas.width, canvas.height)
      gl.uniform2f(uMeshSize, canvas.width, canvas.height)
    }
    resize()
    window.addEventListener('resize', resize)

    const touch = new TouchTexture()
    const onPointer = (e: PointerEvent) => {
      touch.addTouch(e.clientX / window.innerWidth, 1 - e.clientY / window.innerHeight)
    }
    window.addEventListener('pointermove', onPointer, { passive: true })

    let raf = 0
    let shapeReady = false
    let disposed = false
    let last = performance.now()

    loadShapeCanvas()
      .then((c) => {
        if (disposed) return
        upload(0, shapeTex, c, false)
        // The CSS fill covered the page from first paint while the SVG loaded. Hand over to the
        // shader now — before the first draw, or the fill would show through the hole it punches.
        canvas.style.background = 'transparent'
        shapeReady = true
      })
      .catch((err) => {
        console.error('[ButterflyReveal] shape', err)
        if (!disposed) setFailed(true)
      })

    const frame = (now: number) => {
      raf = requestAnimationFrame(frame)
      const dt = Math.min((now - last) / 1000, 0.05)
      last = now
      if (!shapeReady) return

      touch.update(dt)
      upload(1, trailTex, touch.canvas, true)

      gl.clearColor(0, 0, 0, 0)
      gl.clear(gl.COLOR_BUFFER_BIT)
      gl.drawArrays(gl.TRIANGLES, 0, 3)
    }
    raf = requestAnimationFrame(frame)

    return () => {
      disposed = true
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', resize)
      window.removeEventListener('pointermove', onPointer)
      gl.getExtension('WEBGL_lose_context')?.loseContext()
    }
  }, [])

  if (failed) return null

  return (
    <>
      <canvas
        ref={canvasRef}
        aria-hidden
        style={{ background: FILL }}
        className="pointer-events-none fixed inset-0 z-[100] h-full w-full"
      />
      {/* Copy sits on the curtain, above the canvas — black on the pink, the way podium runs black on
          their beige. Placeholder text for now. Padding matches the real header (px-5 sm:px-10, h-19)
          so the logo lands exactly where the site's own logo will be when the curtain clears. */}
      <div aria-hidden className="pointer-events-none fixed inset-0 z-[101] text-black">
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
    </>
  )
}
