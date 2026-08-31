'use client'

import { Component, Suspense, useEffect, useMemo, useRef, useState, type RefObject } from 'react'
import { useFrame, useLoader, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js'

// The R3F port of podium.global's entry scene. Same architecture as theirs: one canvas holding every
// visual, ordered by renderOrder, with the DOM sitting on top — the shape is not geometry, it is a
// hole punched in a fullscreen coloured plane, so you look *through* the curtain at what is behind it.
//
// Behind the hole: a video plane (podium runs Mux there) and one mesh.
//
// The mesh is podium's own rock, pulled out of the HAR. It is here to answer one question — whether
// this scene wants to be real 3D or stay a flat canvas — and it is gitignored, not committed. It has
// to be replaced with our own art before any of this ships.

export const FILL = '#ff6d6a' // same pink the old curtain used

const SHAPE_SIZE = 512 // shape mask resolution (POT)
const TRAIL_SIZE = 512 // mouse trail resolution (POT)
const SHAPE_BLUR = 10 // px of blur baked into the mask; widens the band the fluid trail can wobble
const SHAPE_INSET = 0.62 // butterfly occupies this fraction of the square, leaving room for the blur
// Half-width of the antialiased edge, in mask-value units. Coupled to SHAPE_BLUR: the blur decides how
// fast the mask ramps 0 -> 1 across the outline, and this decides how much of that ramp reads as soft
// edge. Podium can use ~0.003 because their mask is a real baked SDF that ramps slowly; a blurred
// bitmap ramps far steeper, and that band would land inside a single pixel — hard, jagged, and it
// turns the trail displacement into binary noise instead of a wobble.
const EDGE_SOFTNESS = 0.06

// Lifted verbatim from podium's hero config — already tuned, no reason to re-derive.
const CFG = {
  fluidIntensity: 0.6,
  noiseIntensity: 0.6,
  barrelIntensity: 6,
  uvScale: 0.85, // shape covers ~SHAPE_INSET/uvScale of the viewport's short side, so ~73%
  pulseMult: 0.2,
}

// three injects position/uv/matrices and the float precision, so this declares neither.
const VERT = `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`

const FRAG = `
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

  // Shrinking the UV about centre scales the shape up; by the end of the outro it has grown past the
  // viewport, the fill is gone, and what is behind is fully exposed. This stands in for podium moving
  // the mesh toward the camera — same read, and it cannot desync from the plane's own size.
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

  // The bloom term keeps the screen corners opaque no matter how far the shape is zoomed, so the zoom
  // alone never clears the curtain — podium's plane physically leaves the frustum, ours cannot. Fade
  // the whole plane over the back half of the outro so it reliably reaches zero.
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

// Both mask and trail are read as raw numbers, not as colour — an sRGB decode would move the 0.5
// threshold the shader compares the green channel against and warp the outline.
const asData = <T extends THREE.Texture>(t: T): T => {
  t.colorSpace = THREE.NoColorSpace
  t.minFilter = t.magFilter = THREE.LinearFilter
  t.wrapS = t.wrapT = THREE.ClampToEdgeWrapping
  return t
}

type Progress = RefObject<number>

function Curtain({
  progress,
  trail,
  onReady,
}: {
  progress: Progress
  trail: TouchTexture
  onReady: () => void
}) {
  const { viewport, size } = useThree()
  const [shape, setShape] = useState<THREE.CanvasTexture | null>(null)

  useEffect(() => {
    let dead = false
    loadShapeCanvas()
      .then((c) => {
        if (dead) return
        const t = asData(new THREE.CanvasTexture(c))
        t.flipY = false // the shader flips the shape itself, so three must not
        setShape(t)
        onReady()
      })
      .catch((err) => {
        console.error('[ButterflyScene] shape', err)
        onReady() // no mask means no hole; better to show the scene than hold a blank pink screen
      })
    return () => {
      dead = true
    }
  }, [onReady])

  useEffect(() => () => shape?.dispose(), [shape])

  const trailTex = useMemo(() => asData(new THREE.CanvasTexture(trail.canvas)), [trail])
  useEffect(() => () => trailTex.dispose(), [trailTex])

  // Built by hand and attached as a primitive rather than declared as <shaderMaterial uniforms={...}>.
  // The uniform object then belongs to us end to end: nothing between here and the GL call can copy
  // it, re-apply it on a re-render, or leave a sampler bound to the value it had at compile time.
  const material = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader: VERT,
        fragmentShader: FRAG,
        transparent: true,
        depthTest: false,
        depthWrite: false,
        uniforms: {
          // Entrance still pinned: shape fully open, no bloom. Scroll is the only thing driving.
          uShapeReveal: { value: 1 },
          uPulseReveal: { value: 0 },
          uScrollProgress: { value: 0 },
          uShapeTexture: { value: null as THREE.Texture | null },
          uMouseTexture: { value: trailTex },
          uMeshSize: { value: new THREE.Vector2(1, 1) },
          // A plain Vector3, not a THREE.Color. Color runs the hex through sRGB -> linear on the way
          // in, and a custom ShaderMaterial gets no matching encode on the way out, so the fill came
          // out as its own linear values: #ff6d6a rendered as rgb(255, 39, 37). Raw numbers, no
          // colour management, what you type is what you see.
          uColor: {
            value: new THREE.Vector3(
              ...([1, 3, 5].map((i) => parseInt(FILL.slice(i, i + 2), 16) / 255) as [
                number,
                number,
                number,
              ]),
            ),
          },
        },
      }),
    [trailTex],
  )
  useEffect(() => () => material.dispose(), [material])

  // During render, not in an effect: an effect lands a frame late, and the sampler spends that frame
  // bound to three's default empty texture — which reads black, which is "outside the shape"
  // everywhere, which is a screen of flat fill and no hole at all.
  material.uniforms.uShapeTexture.value = shape
  material.uniforms.uMeshSize.value.set(size.width, size.height)

  useFrame((_, dt) => {
    trail.update(Math.min(dt, 0.05))
    trailTex.needsUpdate = true
    material.uniforms.uScrollProgress.value = progress.current
  })

  if (!shape) return null

  // Last thing drawn, and it ignores depth entirely — it is a screen-space overlay that happens to
  // live in the scene graph, so nothing behind it can ever punch through.
  return (
    <mesh renderOrder={10} scale={[viewport.width, viewport.height, 1]}>
      <planeGeometry args={[1, 1]} />
      <primitive object={material} attach="material" />
    </mesh>
  )
}

// object-fit: cover, in world units. Podium's is a Mux stream; ours is a file out of /public.
function VideoPlane({ src, progress }: { src: string; progress: Progress }) {
  const { viewport } = useThree()
  const group = useRef<THREE.Group>(null)
  const [aspect, setAspect] = useState(16 / 9)

  const video = useMemo(() => {
    const v = document.createElement('video')
    v.src = src
    v.loop = true
    v.muted = true // autoplay is only allowed muted
    v.playsInline = true
    v.preload = 'auto'
    return v
  }, [src])

  const tex = useMemo(() => {
    const t = new THREE.VideoTexture(video)
    t.colorSpace = THREE.SRGBColorSpace
    return t
  }, [video])

  useEffect(() => {
    const onMeta = () => setAspect(video.videoWidth / video.videoHeight || 16 / 9)
    video.addEventListener('loadedmetadata', onMeta)
    void video.play().catch(() => {}) // a blocked autoplay just leaves a black plane, not an error
    return () => {
      video.removeEventListener('loadedmetadata', onMeta)
      video.pause()
      video.removeAttribute('src')
      video.load()
      tex.dispose()
    }
  }, [video, tex])

  // Drifts toward the viewer as the hole opens, so the reveal has parallax rather than a flat wipe.
  useFrame(() => {
    group.current?.scale.setScalar(1 + progress.current * 0.35)
  })

  const cover = Math.max(viewport.width / aspect, viewport.height)

  return (
    <group ref={group}>
      <mesh position={[0, 0, -1]} scale={[cover * aspect, cover, 1]}>
        <planeGeometry args={[1, 1]} />
        <meshBasicMaterial map={tex} toneMapped={false} />
      </mesh>
    </group>
  )
}

// Podium's rock, DRACO-compressed. The decoder is copied out of three's examples into /public/draco
// rather than pulled off a CDN — same files, no third-party request, and it works offline.
const MODEL = '/models/rockPodium-lite.glb' // the 644KB LOD; rockPodium.glb is the 2.4MB one

function Rock({ progress }: { progress: Progress }) {
  const gltf = useLoader(GLTFLoader, MODEL, (loader) => {
    const draco = new DRACOLoader()
    draco.setDecoderPath('/draco/')
    ;(loader as GLTFLoader).setDRACOLoader(draco)
  })

  // The model arrives at whatever scale and origin it was authored at, and we have no say in either.
  // Measure it once and normalise: centred on the origin, longest axis two world units.
  const object = useMemo(() => {
    const o = gltf.scene.clone(true)
    const box = new THREE.Box3().setFromObject(o)
    const size = box.getSize(new THREE.Vector3())
    const centre = box.getCenter(new THREE.Vector3())
    const k = 2 / Math.max(size.x, size.y, size.z || 1)
    o.position.sub(centre).multiplyScalar(k)
    o.scale.setScalar(k)
    return o
  }, [gltf])

  const ref = useRef<THREE.Group>(null)
  useFrame((_, dt) => {
    const g = ref.current
    if (!g) return
    g.rotation.y += dt * 0.15
    g.scale.setScalar(1 + progress.current * 1.5)
  })

  return (
    <group ref={ref}>
      <primitive object={object} />
    </group>
  )
}

// A failed model load throws out of Suspense and, with nothing to catch it, unmounts the whole
// canvas — curtain included. That is the red screen: no hole, no scene, just the fallback fill. The
// rock is the least important thing on screen, so it gets to fail alone.
class ModelBoundary extends Component<{ children: React.ReactNode }, { failed: boolean }> {
  state = { failed: false }
  static getDerivedStateFromError() {
    return { failed: true }
  }
  componentDidCatch(err: unknown) {
    console.error('[ButterflyScene] model', err)
  }
  render() {
    return this.state.failed ? null : this.props.children
  }
}

export function ButterflyScene({ progress, onReady }: { progress: Progress; onReady: () => void }) {
  const trail = useMemo(() => new TouchTexture(), [])

  useEffect(() => {
    const onPointer = (e: PointerEvent) => {
      trail.addTouch(e.clientX / window.innerWidth, 1 - e.clientY / window.innerHeight)
    }
    window.addEventListener('pointermove', onPointer, { passive: true })
    return () => window.removeEventListener('pointermove', onPointer)
  }, [trail])

  return (
    <>
      <ambientLight intensity={1.1} />
      <directionalLight position={[3, 4, 5]} intensity={2.6} />
      <VideoPlane src="/whoweare/vajra.mp4" progress={progress} />
      {/* The rock streams in behind the curtain, so there is nothing to show while it does. */}
      <ModelBoundary>
        <Suspense fallback={null}>
          <Rock progress={progress} />
        </Suspense>
      </ModelBoundary>
      <Curtain progress={progress} trail={trail} onReady={onReady} />
    </>
  )
}
