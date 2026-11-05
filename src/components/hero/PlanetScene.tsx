import { useEffect, useRef } from 'react'
import {
  AdditiveBlending,
  BackSide,
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
  SphereGeometry,
  SRGBColorSpace,
  Vector3,
  WebGLRenderer,
} from 'three'
type PlanetSceneProps = {
  className?: string
  onReady?: () => void
  onFailed?: () => void
}

function supportsWebGL(): boolean {
  try {
    const canvas = document.createElement('canvas')
    const gl = canvas.getContext('webgl2', { failIfMajorPerformanceCaveat: false })
      || canvas.getContext('webgl', { failIfMajorPerformanceCaveat: false })
      || canvas.getContext('experimental-webgl', { failIfMajorPerformanceCaveat: false })
    return Boolean(gl)
  } catch {
    return false
  }
}

function createRng(seed: number) {
  let state = seed >>> 0
  return () => {
    state = (state + 0x6d2b79f5) >>> 0
    let t = state
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

function createStarSprite() {
  const canvas = document.createElement('canvas')
  canvas.width = 64
  canvas.height = 64
  const ctx = canvas.getContext('2d')
  if (!ctx) return new CanvasTexture(canvas)
  const g = ctx.createRadialGradient(32, 32, 1, 32, 32, 28)
  g.addColorStop(0, 'rgba(255,255,255,1)')
  g.addColorStop(0.2, 'rgba(200,240,255,0.85)')
  g.addColorStop(1, 'rgba(120,195,255,0)')
  ctx.fillStyle = g
  ctx.fillRect(0, 0, 64, 64)
  const texture = new CanvasTexture(canvas)
  texture.needsUpdate = true
  return texture
}

function createPlanetTexture(rng: () => number) {
  const size = 512
  const canvas = document.createElement('canvas')
  canvas.width = size
  canvas.height = size
  const ctx = canvas.getContext('2d')
  if (!ctx) return new CanvasTexture(canvas)

  ctx.fillStyle = '#05070d'
  ctx.fillRect(0, 0, size, size)

  for (let i = 0; i < 1800; i += 1) {
    const x = rng() * size
    const y = rng() * size
    const r = 0.4 + rng() * 3.2
    const a = 0.015 + rng() * 0.05
    ctx.fillStyle = `rgba(${20 + rng() * 30},${30 + rng() * 40},${45 + rng() * 40},${a})`
    ctx.beginPath()
    ctx.arc(x, y, r, 0, Math.PI * 2)
    ctx.fill()
  }

  for (let y = 0; y < size; y += 8) {
    ctx.fillStyle = `rgba(0,0,0,${0.04 + (y % 24 === 0 ? 0.06 : 0)})`
    ctx.fillRect(0, y, size, 3)
  }

  const texture = new CanvasTexture(canvas)
  texture.needsUpdate = true
  return texture
}

function createGlowSprite() {
  const canvas = document.createElement('canvas')
  canvas.width = 256
  canvas.height = 256
  const ctx = canvas.getContext('2d')
  if (!ctx) return new CanvasTexture(canvas)
  const g = ctx.createRadialGradient(128, 128, 16, 128, 128, 120)
  g.addColorStop(0, 'rgba(103,232,249,0.55)')
  g.addColorStop(0.35, 'rgba(34,211,238,0.22)')
  g.addColorStop(0.7, 'rgba(37,99,235,0.08)')
  g.addColorStop(1, 'rgba(0,0,0,0)')
  ctx.fillStyle = g
  ctx.fillRect(0, 0, 256, 256)
  const texture = new CanvasTexture(canvas)
  texture.needsUpdate = true
  return texture
}

function createStarField(
  count: number,
  sprite: CanvasTexture,
  rng: () => number,
) {
  const positions = new Float32Array(count * 3)
  for (let i = 0; i < count; i += 1) {
    const i3 = i * 3
    const radius = 18 + rng() * 40
    const theta = rng() * Math.PI * 2
    const phi = Math.acos(2 * rng() - 1)
    positions[i3] = radius * Math.sin(phi) * Math.cos(theta)
    positions[i3 + 1] = radius * Math.sin(phi) * Math.sin(theta)
    positions[i3 + 2] = radius * Math.cos(phi)
  }
  const geometry = new BufferGeometry()
  geometry.setAttribute('position', new BufferAttribute(positions, 3))
  const material = new PointsMaterial({
    color: new Color('#c8ecff'),
    size: 0.08,
    map: sprite,
    transparent: true,
    opacity: 0.85,
    depthWrite: false,
    blending: AdditiveBlending,
    sizeAttenuation: true,
  })
  return new Points(geometry, material)
}

function buildLightningPath(
  start: Vector3,
  end: Vector3,
  generations: number,
  rng: () => number,
) {
  let segments: Array<[Vector3, Vector3]> = [[start.clone(), end.clone()]]
  for (let g = 0; g < generations; g += 1) {
    const next: Array<[Vector3, Vector3]> = []
    for (const [a, b] of segments) {
      const mid = a.clone().add(b).multiplyScalar(0.5)
      const strength = a.distanceTo(b) * (0.14 + rng() * 0.16)
      mid.x += (rng() - 0.5) * strength * 2
      mid.y += (rng() - 0.5) * strength
      mid.z += (rng() - 0.5) * strength * 1.4
      next.push([a, mid], [mid, b])
      if (rng() < 0.32) {
        const branch = mid.clone().add(
          new Vector3(
            (rng() - 0.5) * strength * 2.2,
            (rng() - 0.5) * strength * 1.6,
            (rng() - 0.5) * strength,
          ),
        )
        next.push([mid, branch])
      }
    }
    segments = next
  }

  const positions = new Float32Array(segments.length * 6)
  segments.forEach(([a, b], index) => {
    const i = index * 6
    positions[i] = a.x
    positions[i + 1] = a.y
    positions[i + 2] = a.z
    positions[i + 3] = b.x
    positions[i + 4] = b.y
    positions[i + 5] = b.z
  })
  return positions
}

function createBolt() {
  const geometry = new BufferGeometry()
  geometry.setAttribute('position', new BufferAttribute(new Float32Array(6), 3))
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
  glowLine.scale.setScalar(1.02)
  const group = new Group()
  group.add(glowLine, coreLine)
  group.visible = false
  return { group, core, glow, coreLine, glowLine }
}

export function PlanetScene({ className, onReady, onFailed }: PlanetSceneProps) {
  const hostRef = useRef<HTMLDivElement | null>(null)
  const onReadyRef = useRef(onReady)
  const onFailedRef = useRef(onFailed)

  useEffect(() => {
    onReadyRef.current = onReady
    onFailedRef.current = onFailed
  }, [onReady, onFailed])

  useEffect(() => {
    const host = hostRef.current
    if (!host) return

    if (!supportsWebGL()) {
      onFailedRef.current?.()
      return
    }

    const lifetime = {
      disposed: false,
      visible: true,
      pageVisible: document.visibilityState === 'visible',
      looping: false,
      frameId: 0,
      boltIndex: 0,
    }

    const compact =
      typeof window.matchMedia === 'function'
        ? window.matchMedia('(max-width: 768px)').matches
        : window.innerWidth <= 768
    const starCount = compact ? 420 : 620
    const segments = compact ? 64 : 80

    const scene = new Scene()
    scene.background = new Color('#02040a')
    scene.fog = new FogExp2('#02040a', 0.028)

    const camera = new PerspectiveCamera(36, 1, 0.1, 140)
    camera.position.set(0.15, 0.05, 7.4)

    let renderer: WebGLRenderer
    try {
      renderer = new WebGLRenderer({
        antialias: true,
        alpha: false,
        powerPreference: 'default',
        failIfMajorPerformanceCaveat: false,
      })
    } catch {
      onFailedRef.current?.()
      return
    }

    renderer.outputColorSpace = SRGBColorSpace
    renderer.setClearColor('#02040a', 1)
    renderer.domElement.style.display = 'block'
    renderer.domElement.style.width = '100%'
    renderer.domElement.style.height = '100%'
    renderer.domElement.style.pointerEvents = 'none'
    renderer.domElement.setAttribute('aria-hidden', 'true')
    host.appendChild(renderer.domElement)

    const root = new Group()
    scene.add(root)

    const starSprite = createStarSprite()
    const stars = createStarField(starCount, starSprite, createRng(0x53544152))
    root.add(stars)

    const planetTexture = createPlanetTexture(createRng(0x564f4c54))
    const planet = new Mesh(
      new SphereGeometry(6.6, segments, segments),
      new MeshBasicMaterial({
        map: planetTexture,
        color: new Color('#070b12'),
      }),
    )
    planet.position.set(-0.55, -3.85, -2.4)
    root.add(planet)

    const atmosMat = new MeshBasicMaterial({
      color: new Color('#22d3ee'),
      transparent: true,
      opacity: 0.08,
      side: BackSide,
      depthWrite: false,
      blending: AdditiveBlending,
    })
    const atmosphere = new Mesh(new SphereGeometry(6.95, 40, 40), atmosMat)
    atmosphere.position.copy(planet.position)
    root.add(atmosphere)

    const rimBand = new Mesh(
      new SphereGeometry(6.75, 48, 16, 0, Math.PI * 2, Math.PI * 0.38, Math.PI * 0.14),
      new MeshBasicMaterial({
        color: new Color('#67e8f9'),
        transparent: true,
        opacity: 0.16,
        depthWrite: false,
        blending: AdditiveBlending,
      }),
    )
    rimBand.position.copy(planet.position)
    rimBand.rotation.z = 0.18
    root.add(rimBand)

    const glowTex = createGlowSprite()
    const bloomMat = new MeshBasicMaterial({
      map: glowTex,
      transparent: true,
      opacity: 0.5,
      depthWrite: false,
      blending: AdditiveBlending,
    })
    const bloom = new Mesh(new PlaneGeometry(16, 2.4), bloomMat)
    bloom.position.set(1.1, 0.15, 0.8)
    bloom.rotation.z = -0.42
    root.add(bloom)

    const boltA = createBolt()
    const boltB = createBolt()
    root.add(boltA.group, boltB.group)

    const lightning = {
      nextAt: performance.now() + 2400,
      activeUntil: 0,
      startedAt: 0,
    }
    const clock = { last: performance.now() }
    const scratch = { start: new Vector3(), end: new Vector3() }

    const resize = () => {
      if (lifetime.disposed) return
      const width = host.clientWidth || window.innerWidth
      const height = host.clientHeight || window.innerHeight
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2))
      renderer.setSize(width, height, false)
      camera.aspect = width / Math.max(height, 1)
      camera.updateProjectionMatrix()
    }

    const resizeObserver =
      typeof ResizeObserver !== 'undefined' ? new ResizeObserver(resize) : null
    resizeObserver?.observe(host)
    if (!resizeObserver) window.addEventListener('resize', resize)
    resize()

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
            { threshold: 0.05, rootMargin: '10% 0px' },
          )
        : null
    intersection?.observe(host)

    const triggerLightning = (now: number) => {
      const rng = createRng(0x4c494748 + lifetime.boltIndex)
      lifetime.boltIndex += 1
      scratch.start.set(6.2 + rng() * 1.5, 1.4 + rng() * 1.8, 0.1 + rng() * 0.6)
      scratch.end.set(2.1 + rng() * 0.7, -0.15 + rng() * 0.55, 0.35)

      const positions = buildLightningPath(
        scratch.start,
        scratch.end,
        compact ? 3 : 4,
        rng,
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

      lightning.startedAt = now
      lightning.activeUntil = now + 520
      lightning.nextAt = now + 6400
    }

    const animate = (now: number) => {
      if (lifetime.disposed || !lifetime.looping) return
      lifetime.frameId = requestAnimationFrame(animate)

      const delta = Math.min((now - clock.last) / 1000, 0.05)
      clock.last = now
      const t = now * 0.001

      planet.rotation.y += delta * 0.12
      atmosphere.rotation.y = planet.rotation.y * 0.92
      rimBand.rotation.y = planet.rotation.y * 0.5
      stars.rotation.y -= delta * 0.008
      stars.rotation.x = Math.sin(t * 0.05) * 0.02

      const pulse = Math.sin(t * 1.7) * 0.5 + 0.5
      atmosMat.opacity = 0.05 + pulse * 0.08
      bloomMat.opacity = 0.18 + pulse * 0.62

      if (now >= lightning.nextAt && now >= lightning.activeUntil) {
        triggerLightning(now)
      }

      if (now < lightning.activeUntil) {
        const elapsed = now - lightning.startedAt
        const strength =
          elapsed < 50
            ? elapsed / 50
            : elapsed < 110
              ? 0.18
              : elapsed < 180
                ? 0.78
                : 0.78 * (1 - (elapsed - 180) / 340)
        const s = Math.max(0, Math.min(1, strength))
        boltA.core.opacity = s * 0.9
        boltA.glow.opacity = s * 0.4
        boltB.core.opacity = s * 0.45
        boltB.glow.opacity = s * 0.2
        atmosMat.opacity = 0.07 + s * 0.12
        bloomMat.opacity = 0.42 + s * 0.28
      } else {
        boltA.group.visible = false
        boltB.group.visible = false
        boltA.core.opacity = 0
        boltA.glow.opacity = 0
        boltB.core.opacity = 0
        boltB.glow.opacity = 0
      }

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
      scene.traverse((object) => {
        if (
          object instanceof Mesh ||
          object instanceof Points ||
          object instanceof LineSegments
        ) {
          object.geometry.dispose()
          const material = object.material
          const mats = Array.isArray(material) ? material : [material]
          for (const mat of mats) {
            if ('map' in mat && mat.map && !disposedTextures.has(mat.map)) {
              mat.map.dispose()
              disposedTextures.add(mat.map)
            }
            mat.dispose()
          }
        }
      })

      for (const texture of [starSprite, planetTexture, glowTex]) {
        if (!disposedTextures.has(texture)) texture.dispose()
      }

      renderer.forceContextLoss()
      renderer.dispose()
      if (renderer.domElement.parentElement === host) {
        host.removeChild(renderer.domElement)
      }
    }
  }, [])

  return <div ref={hostRef} className={className} aria-hidden="true" />
}
