import { useEffect, useId, useRef } from 'react'
import { TEAM_MEMBERS, type TeamMember } from '../data/site'
import { useReveal } from '../hooks/useReveal'

const CRUISE = 0.22
const MAX_BOOST = 2.8
const SLOT_REM = 12.5

const ACCENT: Record<
  TeamMember['accent'],
  { band: string; glow: string; chip: string }
> = {
  blue: {
    band: 'from-blue-500 to-cyan-400',
    glow: 'shadow-[0_0_36px_rgba(59,130,246,0.24)]',
    chip: 'from-blue-500/35 to-cyan-400/15',
  },
  cyan: {
    band: 'from-cyan-400 to-blue-500',
    glow: 'shadow-[0_0_36px_rgba(34,211,238,0.26)]',
    chip: 'from-cyan-400/35 to-blue-500/15',
  },
  teal: {
    band: 'from-teal-400 to-cyan-500',
    glow: 'shadow-[0_0_32px_rgba(45,212,191,0.22)]',
    chip: 'from-teal-400/30 to-cyan-400/10',
  },
  sky: {
    band: 'from-sky-400 to-cyan-400',
    glow: 'shadow-[0_0_32px_rgba(56,189,248,0.22)]',
    chip: 'from-sky-400/30 to-cyan-400/10',
  },
}

type Motion = {
  position: number
  velocity: number
  dragging: boolean
  pointerId: number
  lastX: number
  lastTime: number
  moved: number
}

function wrapDistance(index: number, position: number, count: number) {
  let distance = index - position
  distance = ((distance % count) + count) % count
  if (distance > count / 2) distance -= count
  return distance
}

function cardPose(distance: number) {
  const abs = Math.abs(distance)
  const scale =
    abs <= 1
      ? 1.05 + (0.9 - 1.05) * abs
      : abs <= 2
        ? 0.9 + (0.78 - 0.9) * (abs - 1)
        : 0.78
  const opacity =
    abs <= 1
      ? 1 + (0.8 - 1) * abs
      : abs <= 2
        ? 0.8 + (0.28 - 0.8) * (abs - 1)
        : Math.max(0.08, 0.28 - (abs - 2) * 0.16)
  const nudge =
    abs <= 1 ? 10 + (-8 - 10) * abs : abs <= 2 ? -8 + (28 - -8) * (abs - 1) : 28

  return { abs, scale, opacity, nudge }
}

function InitialsPortrait({
  initials,
  accent,
}: {
  initials: string
  accent: TeamMember['accent']
}) {
  return (
    <div
      aria-hidden="true"
      className={`mx-auto grid h-[4.5rem] w-[4.5rem] place-items-center rounded-full border border-white/15 bg-gradient-to-br ${ACCENT[accent].chip} font-display text-lg font-semibold tracking-wide text-white`}
    >
      {initials}
    </div>
  )
}

function TeamCard({ member, index }: { member: TeamMember; index: number }) {
  const accent = ACCENT[member.accent]

  return (
    <div
      data-team-card
      data-index={index}
      className="absolute left-1/2 top-8 w-[min(16.25rem,calc(100%-2rem))] select-none"
    >
      <div className="relative flex flex-col items-center">
        <span
          aria-hidden="true"
          className="mb-[-2px] h-3 w-3 rounded-full border-2 border-cyan-300/80 bg-navy-900"
        />
        <span
          aria-hidden="true"
          className="h-7 w-px bg-gradient-to-b from-cyan-300/80 to-cyan-300/10"
        />
        <article
          className={`flex h-[19.5rem] w-full flex-col overflow-hidden rounded-2xl border border-white/12 bg-[linear-gradient(180deg,#152238_0%,#0b1220_100%)] text-left ${accent.glow}`}
        >
          <span
            aria-hidden="true"
            className={`h-1.5 w-full bg-gradient-to-r ${accent.band}`}
          />
          <div className="flex flex-1 flex-col p-5">
            <InitialsPortrait initials={member.initials} accent={member.accent} />
            <p className="mt-5 text-center font-display text-lg font-semibold text-white">
              {member.name}
            </p>
            <p className="mt-2 line-clamp-3 text-center text-sm font-medium leading-snug text-cyan-300/90">
              {member.role}
            </p>
            <a
              href={member.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`LinkedIn profile for ${member.name}`}
              className="mt-auto inline-flex min-h-11 w-full cursor-pointer items-center justify-center gap-2 rounded-full border border-cyan-300/40 px-4 text-sm font-semibold text-cyan-100 transition-colors duration-200 hover:border-cyan-300 hover:bg-cyan-300/10"
            >
              LinkedIn
              <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true">
                <path
                  d="M4 10 10 4M5.5 4H10v4.5"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  fill="none"
                />
              </svg>
            </a>
          </div>
        </article>
      </div>
    </div>
  )
}

export function Team() {
  const sectionRef = useReveal<HTMLElement>()
  const labelId = useId()
  const viewportRef = useRef<HTMLDivElement>(null)
  const motionRef = useRef<Motion>({
    position: 2,
    velocity: 0,
    dragging: false,
    pointerId: -1,
    lastX: 0,
    lastTime: 0,
    moved: 0,
  })

  useEffect(() => {
    const viewport = viewportRef.current
    if (!viewport) return

    const motion = motionRef.current
    const count = TEAM_MEMBERS.length
    const cards = [
      ...viewport.querySelectorAll<HTMLElement>('[data-team-card]'),
    ]
    let frame = 0
    let looping = false
    let last = performance.now()
    let slot = SLOT_REM * 16
    let suppressClick = false

    const measure = () => {
      slot =
        SLOT_REM *
        (Number.parseFloat(getComputedStyle(document.documentElement).fontSize) || 16)
    }

    const paint = () => {
      for (const card of cards) {
        const index = Number(card.dataset.index)
        const distance = wrapDistance(index, motion.position, count)
        const pose = cardPose(distance)
        card.style.transform = `translateX(calc(-50% + ${distance * SLOT_REM}rem)) translateY(${pose.nudge}px) scale(${pose.scale})`
        card.style.opacity = pose.opacity.toFixed(3)
        card.style.zIndex = String(30 - Math.round(pose.abs * 8))
        card.style.pointerEvents = pose.abs > 1.35 ? 'none' : 'auto'
      }
    }

    const shouldRun = () => !document.hidden

    const stop = () => {
      looping = false
      if (!frame) return
      window.cancelAnimationFrame(frame)
      frame = 0
    }

    const tick = (now: number) => {
      frame = 0
      const dt = Math.min(0.05, (now - last) / 1000)
      last = now
      if (!motion.dragging) {
        motion.position += (CRUISE + motion.velocity) * dt
        motion.velocity *= Math.exp(-1.8 * dt)
        if (Math.abs(motion.velocity) < 0.02) motion.velocity = 0
      }
      paint()
      if (!shouldRun()) {
        looping = false
        return
      }
      frame = window.requestAnimationFrame(tick)
    }

    const start = () => {
      if (looping || !shouldRun()) return
      looping = true
      last = performance.now()
      frame = window.requestAnimationFrame(tick)
    }

    const onPointerDown = (event: PointerEvent) => {
      if (event.button !== 0) return
      if ((event.target as HTMLElement).closest('a')) return
      event.preventDefault()
      window.getSelection()?.removeAllRanges()
      motion.dragging = true
      motion.pointerId = event.pointerId
      motion.lastX = event.clientX
      motion.lastTime = performance.now()
      motion.moved = 0
      motion.velocity = 0
      viewport.dataset.dragging = 'true'
      viewport.setPointerCapture(event.pointerId)
      start()
    }

    const onPointerMove = (event: PointerEvent) => {
      if (!motion.dragging || motion.pointerId !== event.pointerId) return
      event.preventDefault()
      const now = performance.now()
      const dx = event.clientX - motion.lastX
      const dt = Math.max(16, now - motion.lastTime) / 1000
      motion.position -= dx / slot
      motion.moved += Math.abs(dx)
      motion.velocity = Math.max(-MAX_BOOST, Math.min(MAX_BOOST, -dx / dt / slot))
      motion.lastX = event.clientX
      motion.lastTime = now
      window.getSelection()?.removeAllRanges()
      paint()
    }

    const endDrag = (event: PointerEvent) => {
      if (!motion.dragging || motion.pointerId !== event.pointerId) return
      motion.dragging = false
      motion.pointerId = -1
      delete viewport.dataset.dragging
      if (motion.moved > 8) suppressClick = true
      if (viewport.hasPointerCapture(event.pointerId)) {
        viewport.releasePointerCapture(event.pointerId)
      }
      start()
    }

    const onClickCapture = (event: MouseEvent) => {
      if (!suppressClick) return
      event.preventDefault()
      event.stopPropagation()
      suppressClick = false
    }

    const onKeyDown = (event: globalThis.KeyboardEvent) => {
      if (event.key !== 'ArrowRight' && event.key !== 'ArrowLeft') return
      event.preventDefault()
      const direction = event.key === 'ArrowRight' ? 1 : -1
      motion.velocity = Math.max(
        -MAX_BOOST,
        Math.min(MAX_BOOST, motion.velocity + direction * 0.9),
      )
      start()
    }

    const onVisibility = () => {
      if (document.hidden) stop()
      else start()
    }

    measure()
    paint()
    start()

    viewport.addEventListener('pointerdown', onPointerDown)
    viewport.addEventListener('pointermove', onPointerMove)
    viewport.addEventListener('pointerup', endDrag)
    viewport.addEventListener('pointercancel', endDrag)
    viewport.addEventListener('click', onClickCapture, true)
    viewport.addEventListener('keydown', onKeyDown)
    window.addEventListener('resize', measure)
    document.addEventListener('visibilitychange', onVisibility)

    return () => {
      stop()
      viewport.removeEventListener('pointerdown', onPointerDown)
      viewport.removeEventListener('pointermove', onPointerMove)
      viewport.removeEventListener('pointerup', endDrag)
      viewport.removeEventListener('pointercancel', endDrag)
      viewport.removeEventListener('click', onClickCapture, true)
      viewport.removeEventListener('keydown', onKeyDown)
      window.removeEventListener('resize', measure)
      document.removeEventListener('visibilitychange', onVisibility)
    }
  }, [])

  return (
    <section
      id="team"
      ref={sectionRef}
      aria-labelledby="team-heading"
      className="section-reveal section-shell relative overflow-x-clip"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(34,211,238,0.07),transparent_55%)]"
      />

      <div className="relative mx-auto w-full max-w-6xl">
        <div className="mb-8 text-center">
          <p className="hero-brand mb-3 text-sm font-semibold uppercase tracking-[0.2em]">
            Meet the team
          </p>
          <h2
            id="team-heading"
            className="font-display text-3xl font-semibold tracking-tight text-white sm:text-4xl"
          >
            The people building VOLT IQ.
          </h2>
          <p className="mt-3 text-sm text-slate-soft">
            Drag the cards to move them. Each card opens that person’s LinkedIn.
          </p>
        </div>

        <div
          ref={viewportRef}
          role="region"
          aria-roledescription="carousel"
          aria-labelledby={labelId}
          tabIndex={0}
          className="team-marquee relative h-[26.5rem] overflow-hidden outline-none select-none sm:h-[28rem]"
        >
          <p id={labelId} className="sr-only">
            Team profiles move from right to left. Drag the cards or use the
            arrow keys. Each card has a LinkedIn link.
          </p>
          <div
            aria-hidden="true"
            className="pointer-events-none absolute left-[4%] right-[4%] top-10 h-px bg-gradient-to-r from-transparent via-cyan-300/70 to-transparent"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute left-[4%] right-[4%] top-[2.35rem] h-[2px] bg-cyan-400/20 blur-[2px]"
          />
          {TEAM_MEMBERS.map((member, index) => (
            <TeamCard key={member.id} member={member} index={index} />
          ))}
        </div>
      </div>
    </section>
  )
}
