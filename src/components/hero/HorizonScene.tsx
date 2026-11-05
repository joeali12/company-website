import { useEffect, useRef } from 'react'
import {
  AdditiveBlending,
  BufferAttribute,
  BufferGeometry,
  CanvasTexture,
  Color,
  FogExp2,
  Group,
  LineBasicMaterial,
  LineSegments,
  Mesh,
  MeshBasicMaterial,
  PerspectiveCamera,
  PlaneGeometry,
  Points,
  PointsMaterial,
  Scene,
  Shape,
  ShapeGeometry,
  Vector3,
  WebGLRenderer,
} from 'three'
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion'

type HorizonSceneProps = {
  className?: string
  onReady?: () => void
  onFailed?: () => void
}

function supportsWebGL(): boolean {
  try {
    const canvas = document.createElement('canvas')
    return Boolean(
      canvas.getContext('webgl2') ||
        canvas.getContext('webgl') ||
        canvas.getContext('experimental-webgl'),
    )
  } catch {
    return false
  }
}

function createGlowTexture() {
  const canvas = document.createElement('canvas')
  canvas.width = 256
  canvas.height = 256
  const ctx = canvas.getContext('2d')
  if (!ctx) return new CanvasTexture(canvas)

  const gradient = ctx.createRadialGradient(128, 160, 4, 128, 140, 120)
  gradient.addColorStop(0, 'rgba(232, 247, 255, 0.65)')
  gradient.addColorStop(0.2, 'rgba(103, 232, 249, 0.4)')
  gradient.addColorStop(0.45, 'rgba(34, 211, 238, 0.18)')
  gradient.addColorStop(0.72, 'rgba(37, 99, 235, 0.08)')
  gradient.addColorStop(1, 'rgba(6, 11, 22, 0)')
  ctx.fillStyle = gradient
  ctx.fillRect(0, 0, 256, 256)

  const texture = new CanvasTexture(canvas)
  texture.needsUpdate = true
  return texture
}

function createStarSprite() {
  const canvas = document.createElement('canvas')
  canvas.width = 64
  canvas.height = 64
  const context = canvas.getContext('2d')
  if (!context) return new CanvasTexture(canvas)

  const gradient = context.createRadialGradient(32, 32, 1, 32, 32, 28)
  gradient.addColorStop(0, 'rgba(255,255,255,1)')
  gradient.addColorStop(0.16, 'rgba(225,245,255,0.9)')
  gradient.addColorStop(0.4, 'rgba(160,220,255,0.35)')
  gradient.addColorStop(1, 'rgba(120,195,255,0)')
  context.fillStyle = gradient
  context.fillRect(0, 0, 64, 64)
  const texture = new CanvasTexture(canvas)
  texture.needsUpdate = true
  return texture
}

function createStarLayer(
  count: number,
  spread: number,
  yMin: number,
  yMax: number,
  size: number,
  colorHex: string,
  sprite: CanvasTexture,
) {
  const positions = new Float32Array(count * 3)
  for (let i = 0; i < count; i += 1) {
    const i3 = i * 3
    positions[i3] = (Math.random() - 0.5) * spread
    positions[i3 + 1] = yMin + Math.random() * (yMax - yMin)
    positions[i3 + 2] = (Math.random() - 0.5) * spread * 0.65
  }

  const geometry = new BufferGeometry()
  geometry.setAttribute('position', new BufferAttribute(positions, 3))

  const material = new PointsMaterial({
    color: new Color(colorHex),
    size,
    map: sprite,
    alphaTest: 0.025,
    sizeAttenuation: true,
    transparent: true,
    opacity: 0.82,
    depthWrite: false,
    blending: AdditiveBlending,
  })

  return new Points(geometry, material)
}

function createMountainMesh(
  peaks: Array<[number, number]>,
  color: string,
  opacity: number,
  z: number,
  y: number,
) {
  const shape = new Shape()
  shape.moveTo(-32, -10)
  for (const [x, height] of peaks) {
    shape.lineTo(x, height)
  }
  shape.lineTo(32, -10)
  shape.closePath()

  const geometry = new ShapeGeometry(shape)
  const material = new MeshBasicMaterial({
    color: new Color(color),
    transparent: true,
    opacity,
    depthWrite: true,
  })
  const mesh = new Mesh(geometry, material)
  mesh.position.set(0, y, z)
  return mesh
}

function buildLightningPath(
  start: Vector3,
  end: Vector3,
  generations: number,
  scratchMid: Vector3,
  scratchBranch: Vector3,
): Float32Array {
  let segments: Array<[Vector3, Vector3]> = [[start.clone(), end.clone()]]

  for (let g = 0; g < generations; g += 1) {
    const next: Array<[Vector3, Vector3]> = []
    for (const [a, b] of segments) {
      scratchMid.copy(a).add(b).multiplyScalar(0.5)
      const offsetStrength = a.distanceTo(b) * (0.16 + Math.random() * 0.14)
      scratchMid.x += (Math.random() - 0.5) * offsetStrength * 2
      scratchMid.z += (Math.random() - 0.5) * offsetStrength * 0.7
      const mid = scratchMid.clone()
      next.push([a, mid], [mid, b])

      if (Math.random() < 0.28) {
        scratchBranch
          .copy(mid)
          .add(
            new Vector3(
              (Math.random() - 0.5) * offsetStrength * 2.1,
              -Math.random() * offsetStrength * 1.2,
              (Math.random() - 0.5) * offsetStrength * 0.8,
            ),
          )
        next.push([mid, scratchBranch.clone()])
      }
    }
    segments = next
  }

  const positions = new Float32Array(segments.length * 6)
  for (let index = 0; index < segments.length; index += 1) {
    const [a, b] = segments[index]
    const i = index * 6
    positions[i] = a.x
    positions[i + 1] = a.y
    positions[i + 2] = a.z
    positions[i + 3] = b.x
    positions[i + 4] = b.y
    positions[i + 5] = b.z
  }
  return positions
}

function createLightningBolt() {
  const geometry = new BufferGeometry()
  geometry.setAttribute(
    'position',
    new BufferAttribute(new Float32Array(6), 3),
  )
  const core = new LineBasicMaterial({
    color: new Color('#e8f7ff'),
    transparent: true,
    opacity: 0,
    depthWrite: false,
    blending: AdditiveBlending,
  })
  const glow = new LineBasicMaterial({
    color: new Color('#22d3ee'),
    transparent: true,
    opacity: 0,
    depthWrite: false,
    blending: AdditiveBlending,
  })

  const coreLine = new LineSegments(geometry, core)
  const glowLine = new LineSegments(geometry.clone(), glow)
  glowLine.scale.set(1.012, 1.012, 1.012)

  const group = new Group()
  group.add(glowLine, coreLine)
  group.visible = false

  return { group, core, glow, coreLine, glowLine }
}

export function HorizonScene({
  className,
  onReady,
  onFailed,
}: HorizonSceneProps) {
  const hostRef = useRef<HTMLDivElement | null>(null)
  const reducedMotion = usePrefersReducedMotion()
  const onReadyRef = useRef(onReady)
  const onFailedRef = useRef(onFailed)

  useEffect(() => {
    onReadyRef.current = onReady
    onFailedRef.current = onFailed
  }, [onReady, onFailed])

  useEffect(() => {
    const host = hostRef.current
    if (!host) return

    if (reducedMotion || !supportsWebGL()) {
      onFailedRef.current?.()
      return
    }

    const lifetime = {
      disposed: false,
      visible: true,
      pageVisible: document.visibilityState === 'visible',
      looping: false,
      frameId: 0,
    }

    const isMobile =
      typeof window.matchMedia === 'function'
        ? window.matchMedia('(max-width: 768px)').matches
        : window.innerWidth <= 768
    const isLowPower =
      isMobile ||
      (typeof navigator !== 'undefined' &&
        'hardwareConcurrency' in navigator &&
        (navigator.hardwareConcurrency ?? 8) <= 4)

    const scene = new Scene()
    scene.background = new Color('#050a14')
    scene.fog = new FogExp2('#050a14', 0.026)

    const camera = new PerspectiveCamera(52, 1, 0.1, 140)
    camera.position.set(0, 1.55, 9.2)

    let renderer: WebGLRenderer
    try {
      renderer = new WebGLRenderer({
        antialias: !isLowPower,
        alpha: false,
        powerPreference: isLowPower ? 'low-power' : 'high-performance',
      })
    } catch {
      onFailedRef.current?.()
      return
    }

    renderer.setClearColor('#050a14', 1)
    renderer.domElement.style.display = 'block'
    renderer.domElement.style.width = '100%'
    renderer.domElement.style.height = '100%'
    renderer.domElement.style.pointerEvents = 'none'
    renderer.domElement.setAttribute('aria-hidden', 'true')
    host.appendChild(renderer.domElement)

    const root = new Group()
    scene.add(root)
    const starSprite = createStarSprite()

    const starsFar = createStarLayer(
      isLowPower ? 180 : 420,
      42,
      -1,
      18,
      0.03,
      '#9ecbff',
      starSprite,
    )
    const starsMid = createStarLayer(
      isLowPower ? 110 : 260,
      30,
      0,
      15,
      0.045,
      '#c8ecff',
      starSprite,
    )
    const starsNear = createStarLayer(
      isLowPower ? 60 : 130,
      20,
      1,
      12,
      0.06,
      '#e8f7ff',
      starSprite,
    )
    root.add(starsFar, starsMid, starsNear)

    const nebulaTexture = createGlowTexture()
    const nebulaMaterial = new MeshBasicMaterial({
      map: nebulaTexture,
      transparent: true,
      opacity: isLowPower ? 0.32 : 0.44,
      depthWrite: false,
      blending: AdditiveBlending,
    })
    const nebula = new Mesh(new PlaneGeometry(34, 20), nebulaMaterial)
    nebula.position.set(0, 2.8, -14)
    root.add(nebula)

    const horizonTexture = createGlowTexture()
    const horizonMaterial = new MeshBasicMaterial({
      map: horizonTexture,
      transparent: true,
      opacity: 0.36,
      depthWrite: false,
      blending: AdditiveBlending,
    })
    const horizonGlow = new Mesh(new PlaneGeometry(48, 6), horizonMaterial)
    horizonGlow.position.set(0, -0.15, -3.2)
    root.add(horizonGlow)

    const mountains = new Group()
    mountains.add(
      createMountainMesh(
        [
          [-28, -0.8],
          [-22, 0.6],
          [-16, -0.2],
          [-10, 1.8],
          [-4, 0.4],
          [2, 2.4],
          [8, 0.6],
          [14, 1.9],
          [20, 0.2],
          [26, 1.1],
        ],
        '#071221',
        1,
        -8.2,
        -0.85,
      ),
      createMountainMesh(
        [
          [-28, -1.2],
          [-20, 0.1],
          [-13, 1.4],
          [-6, -0.1],
          [0, 1.7],
          [7, 0.35],
          [13, 2.0],
          [19, 0.15],
          [26, -0.7],
        ],
        '#0c1a2e',
        0.96,
        -5.4,
        -1.15,
      ),
      createMountainMesh(
        [
          [-28, -1.8],
          [-18, -0.2],
          [-11, 1.0],
          [-3, -0.35],
          [4, 1.35],
          [11, 0.05],
          [18, 0.95],
          [26, -1.2],
        ],
        '#13243c',
        0.94,
        -2.8,
        -1.45,
      ),
    )
    root.add(mountains)

    const flashTexture = createGlowTexture()
    const flashMaterial = new MeshBasicMaterial({
      map: flashTexture,
      transparent: true,
      opacity: 0,
      depthWrite: false,
      blending: AdditiveBlending,
    })
    const flash = new Mesh(new PlaneGeometry(14, 10), flashMaterial)
    flash.position.set(-6.2, 2.6, -10)
    root.add(flash)

    const boltA = createLightningBolt()
    const boltB = createLightningBolt()
    boltA.group.position.set(0, 0, -7.8)
    boltB.group.position.set(0, 0, -7.5)
    root.add(boltA.group, boltB.group)

    const lightning = {
      nextAt: performance.now() + 2800 + Math.random() * 1800,
      activeUntil: 0,
      startedAt: 0,
      side: -1 as -1 | 1,
    }

    const scrollState = { progress: 0, target: 0 }
    const clock = { last: performance.now() }
    const scratch = {
      start: new Vector3(),
      end: new Vector3(),
      mid: new Vector3(),
      branch: new Vector3(),
    }

    const resize = () => {
      if (lifetime.disposed) return
      const width = host.clientWidth || window.innerWidth
      const height = host.clientHeight || window.innerHeight
      const dprCap = isLowPower
        ? 1.15
        : Math.min(window.devicePixelRatio || 1, 1.75)
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, dprCap))
      renderer.setSize(width, height, false)
      camera.aspect = width / Math.max(height, 1)
      camera.updateProjectionMatrix()
    }

    const resizeObserver =
      typeof ResizeObserver !== 'undefined' ? new ResizeObserver(resize) : null
    resizeObserver?.observe(host)
    if (!resizeObserver) window.addEventListener('resize', resize)
    resize()

    const onScroll = () => {
      const max = Math.max(host.offsetHeight * 0.9, 1)
      scrollState.target = Math.min(Math.max(window.scrollY / max, 0), 1)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()

    const onVisibility = () => {
      lifetime.pageVisible = document.visibilityState === 'visible'
      syncLoop()
    }
    document.addEventListener('visibilitychange', onVisibility)

    const intersection =
      typeof IntersectionObserver !== 'undefined'
        ? new IntersectionObserver(
            ([entry]) => {
              lifetime.visible = Boolean(entry?.isIntersecting)
              syncLoop()
            },
            { threshold: 0.04, rootMargin: '12% 0px' },
          )
        : null
    intersection?.observe(host)

    const triggerLightning = (now: number) => {
      lightning.side = Math.random() > 0.5 ? 1 : -1
      const aspect =
        (host.clientWidth || window.innerWidth) /
        Math.max(host.clientHeight || window.innerHeight, 1)
      const viewHalfHeight =
        Math.tan((camera.fov * Math.PI) / 360) * (camera.position.z + 1.2)
      const viewHalfWidth = viewHalfHeight * aspect
      // Keep bolts near the outer thirds so they never cross center copy/CTAs.
      const xBias =
        lightning.side * viewHalfWidth * (0.78 + Math.random() * 0.14)
      const topY =
        camera.position.y + viewHalfHeight * (0.58 + Math.random() * 0.1)

      scratch.start.set(
        xBias + (Math.random() - 0.5) * viewHalfWidth * 0.06,
        topY,
        -1.4,
      )
      scratch.end.set(
        xBias * (0.72 + Math.random() * 0.1),
        0.4 + Math.random() * 0.35,
        1.2,
      )

      const generations = isLowPower ? 3 : 4
      const positions = buildLightningPath(
        scratch.start,
        scratch.end,
        generations,
        scratch.mid,
        scratch.branch,
      )

      for (const bolt of [boltA, boltB]) {
        const corePrev = bolt.coreLine.geometry.getAttribute('position')
        const glowPrev = bolt.glowLine.geometry.getAttribute('position')
        bolt.coreLine.geometry.setAttribute(
          'position',
          new BufferAttribute(positions, 3),
        )
        bolt.glowLine.geometry.setAttribute(
          'position',
          new BufferAttribute(positions.slice(), 3),
        )
        if (corePrev instanceof BufferAttribute) corePrev.dispose()
        if (glowPrev instanceof BufferAttribute) glowPrev.dispose()
        bolt.group.visible = true
      }

      flash.position.x = xBias * 0.82
      lightning.startedAt = now
      lightning.activeUntil = now + 620
      lightning.nextAt = now + 7200 + Math.random() * 5200
    }

    const animate = (now: number) => {
      if (lifetime.disposed || !lifetime.looping) return

      lifetime.frameId = requestAnimationFrame(animate)

      const delta = Math.min((now - clock.last) / 1000, 0.05)
      clock.last = now

      scrollState.progress +=
        (scrollState.target - scrollState.progress) * Math.min(1, delta * 4)

      const t = now * 0.001
      starsFar.rotation.z = t * 0.005
      starsMid.rotation.z = -t * 0.009
      starsNear.rotation.z = t * 0.014
      starsFar.position.x = Math.sin(t * 0.04) * 0.12
      starsMid.position.x = Math.cos(t * 0.06) * 0.18

      const baseNebula = isLowPower ? 0.28 : 0.4
      nebula.rotation.z = Math.sin(t * 0.06) * 0.02
      nebulaMaterial.opacity = baseNebula + Math.sin(t * 0.24) * 0.03
      horizonMaterial.opacity = 0.3 + Math.sin(t * 0.2) * 0.03

      if (now >= lightning.nextAt && now >= lightning.activeUntil) {
        triggerLightning(now)
      }

      if (now < lightning.activeUntil) {
        const elapsed = now - lightning.startedAt
        const strength =
          elapsed < 60
            ? elapsed / 60
            : elapsed < 120
              ? 0.14
              : elapsed < 190
                ? 0.7
                : 0.7 * (1 - (elapsed - 190) / 430)
        const safeStrength = Math.max(0, Math.min(1, strength))

        boltA.core.opacity = safeStrength * 0.78
        boltA.glow.opacity = safeStrength * 0.34
        boltB.core.opacity = safeStrength * 0.42
        boltB.glow.opacity = safeStrength * 0.18
        flashMaterial.opacity = safeStrength * 0.14
        nebulaMaterial.opacity = baseNebula + safeStrength * 0.1
        horizonMaterial.opacity = 0.3 + safeStrength * 0.16
      } else {
        boltA.group.visible = false
        boltB.group.visible = false
        boltA.core.opacity = 0
        boltA.glow.opacity = 0
        boltB.core.opacity = 0
        boltB.glow.opacity = 0
        flashMaterial.opacity = 0
      }

      const p = scrollState.progress
      camera.position.y = 1.55 - p * 0.42
      camera.position.z = 9.2 + p * 0.7
      camera.rotation.x = -0.03 - p * 0.035
      mountains.children[0].position.y = -0.85 - p * 0.15
      mountains.children[1].position.y = -1.15 - p * 0.24
      mountains.children[2].position.y = -1.45 - p * 0.34
      mountains.position.z = p * 0.28
      horizonGlow.position.y = -0.15 - p * 0.14

      renderer.render(scene, camera)
    }

    const syncLoop = () => {
      if (lifetime.disposed) return
      const shouldRun = lifetime.pageVisible && lifetime.visible
      if (shouldRun && !lifetime.looping) {
        clock.last = performance.now()
        lifetime.looping = true
        lifetime.frameId = requestAnimationFrame(animate)
      } else if (!shouldRun && lifetime.looping) {
        lifetime.looping = false
        cancelAnimationFrame(lifetime.frameId)
      }
    }

    const onContextLost = (event: Event) => {
      event.preventDefault()
      lifetime.looping = false
      cancelAnimationFrame(lifetime.frameId)
      onFailedRef.current?.()
    }

    const onContextRestored = () => {
      resize()
      syncLoop()
      onReadyRef.current?.()
    }

    renderer.domElement.addEventListener('webglcontextlost', onContextLost)
    renderer.domElement.addEventListener(
      'webglcontextrestored',
      onContextRestored,
    )

    syncLoop()
    onReadyRef.current?.()

    return () => {
      lifetime.disposed = true
      lifetime.looping = false
      cancelAnimationFrame(lifetime.frameId)
      window.removeEventListener('scroll', onScroll)
      document.removeEventListener('visibilitychange', onVisibility)
      resizeObserver?.disconnect()
      if (!resizeObserver) window.removeEventListener('resize', resize)
      intersection?.disconnect()
      renderer.domElement.removeEventListener('webglcontextlost', onContextLost)
      renderer.domElement.removeEventListener(
        'webglcontextrestored',
        onContextRestored,
      )

      const disposedTextures = new Set<object>()
      const disposeMaterial = (
        material: MeshBasicMaterial | PointsMaterial | LineBasicMaterial,
      ) => {
        if (material.map && !disposedTextures.has(material.map)) {
          material.map.dispose()
          disposedTextures.add(material.map)
        }
        material.dispose()
      }

      scene.traverse((object) => {
        if (
          object instanceof Points ||
          object instanceof Mesh ||
          object instanceof LineSegments
        ) {
          object.geometry.dispose()
          const material = object.material
          if (Array.isArray(material)) {
            material.forEach(disposeMaterial)
          } else {
            disposeMaterial(material)
          }
        }
      })

      for (const texture of [
        nebulaTexture,
        horizonTexture,
        flashTexture,
        starSprite,
      ]) {
        if (!disposedTextures.has(texture)) texture.dispose()
      }

      renderer.forceContextLoss()
      renderer.dispose()
      if (renderer.domElement.parentElement === host) {
        host.removeChild(renderer.domElement)
      }
    }
  }, [reducedMotion])

  return <div ref={hostRef} className={className} aria-hidden="true" />
}
