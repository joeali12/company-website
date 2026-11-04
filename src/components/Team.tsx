import {
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  type KeyboardEvent,
  type PointerEvent as ReactPointerEvent,
} from 'react'
import { TEAM_MEMBERS, type TeamMember } from '../data/site'
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion'
import { useReveal } from '../hooks/useReveal'

const ACCENT: Record<
  TeamMember['accent'],
  { border: string; glow: string; chip: string }
> = {
  violet: {
    border: 'border-violet-400/50',
    glow: 'shadow-[0_0_36px_rgba(167,139,250,0.22)]',
    chip: 'from-violet-400/30 to-fuchsia-400/10',
  },
  cyan: {
    border: 'border-cyan-400/60',
    glow: 'shadow-[0_0_42px_rgba(34,211,238,0.28)]',
    chip: 'from-cyan-400/35 to-blue-500/10',
  },
  amber: {
    border: 'border-amber-400/50',
    glow: 'shadow-[0_0_36px_rgba(251,191,36,0.2)]',
    chip: 'from-amber-400/30 to-orange-400/10',
  },
  teal: {
    border: 'border-teal-400/50',
    glow: 'shadow-[0_0_36px_rgba(45,212,191,0.22)]',
    chip: 'from-teal-400/30 to-cyan-400/10',
  },
}

function PortraitPlaceholder({ accent }: { accent: TeamMember['accent'] }) {
  return (
    <div
      aria-hidden="true"
      className={`mx-auto grid h-20 w-20 place-items-center rounded-full border border-white/15 bg-gradient-to-br ${ACCENT[accent].chip}`}
    >
      <svg width="34" height="34" viewBox="0 0 34 34" className="text-white/55">
        <circle cx="17" cy="12" r="6" fill="currentColor" />
        <path
          d="M6 28c2.4-6 19.6-6 22 0"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
          fill="none"
        />
      </svg>
    </div>
  )
}

function TeamCard({
  member,
  active,
  flipped,
  offset,
  onActivate,
  reducedMotion,
}: {
  member: TeamMember
  active: boolean
  flipped: boolean
  offset: number
  onActivate: () => void
  reducedMotion: boolean
}) {
  const accent = ACCENT[member.accent]
  const heightNudge = offset === 0 ? 8 : offset % 2 === 0 ? 28 : -10
  const scale = active ? 1.06 : Math.abs(offset) === 1 ? 0.9 : 0.78
  const opacity =
    Math.abs(offset) > 1 ? 0.35 : active ? 1 : Math.abs(offset) === 1 ? 0.82 : 0.5

  return (
    <div
      className="absolute left-1/2 top-8 w-[min(82vw,16.75rem)] sm:w-[16.75rem]"
      style={{
        transform: `translateX(calc(-50% + ${offset * 13.25}rem)) translateY(${heightNudge}px) scale(${scale})`,
        opacity,
        zIndex: active ? 20 : 10 - Math.abs(offset),
        transition: reducedMotion
          ? 'none'
          : 'transform 420ms cubic-bezier(0.22, 1, 0.36, 1), opacity 320ms ease',
        pointerEvents: Math.abs(offset) > 1 ? 'none' : 'auto',
      }}
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

        <div className="[perspective:1200px]">
          <button
            type="button"
            aria-pressed={flipped}
            aria-label={
              flipped
                ? `Hide details for ${member.name}`
                : `Meet ${member.name}, ${member.role}`
            }
            onClick={onActivate}
            className={[
              'relative h-[19.5rem] w-full rounded-2xl border text-left outline-offset-4',
              'focus-visible:outline focus-visible:outline-2 focus-visible:outline-cyan-300',
              accent.border,
              active ? accent.glow : 'shadow-[0_18px_40px_rgba(0,0,0,0.35)]',
              reducedMotion ? '' : '[transform-style:preserve-3d] transition-transform duration-500',
              !reducedMotion && flipped ? '[transform:rotateY(180deg)]' : '',
            ].join(' ')}
          >
            <div
              className={[
                'absolute inset-0 flex flex-col rounded-2xl bg-[linear-gradient(180deg,#152238_0%,#0b1220_100%)] p-5',
                reducedMotion
                  ? flipped
                    ? 'hidden'
                    : 'flex'
                  : '[backface-visibility:hidden]',
              ].join(' ')}
            >
              <PortraitPlaceholder accent={member.accent} />
              <p className="mt-5 text-center font-display text-lg font-semibold text-white">
                {member.name}
              </p>
              <p className="mt-1 text-center text-sm font-medium text-cyan-300/90">
                {member.role}
              </p>
              <p className="mt-3 line-clamp-3 text-center text-sm leading-relaxed text-slate-soft">
                {member.bio}
              </p>
              <span className="mt-auto pt-4 text-center text-sm font-semibold text-cyan-300">
                Click to meet →
              </span>
            </div>

            <div
              className={[
                'absolute inset-0 flex flex-col rounded-2xl bg-[linear-gradient(180deg,#1a2b45_0%,#0b1220_100%)] p-5',
                reducedMotion
                  ? flipped
                    ? 'flex'
                    : 'hidden'
                  : '[backface-visibility:hidden] [transform:rotateY(180deg)]',
              ].join(' ')}
            >
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-cyan-300/80">
                Profile
              </p>
              <p className="mt-3 font-display text-xl font-semibold text-white">
                {member.name}
              </p>
              <p className="mt-1 text-sm font-medium text-cyan-300">{member.role}</p>
              <p className="mt-4 flex-1 text-sm leading-relaxed text-slate-soft">
                {member.bio}
              </p>
              <p className="mt-4 text-xs leading-relaxed text-slate-muted">
                Placeholder profile — replace with confirmed team details.
              </p>
              <span className="mt-3 text-sm font-semibold text-cyan-300">
                Click to return
              </span>
            </div>
          </button>
        </div>
      </div>
    </div>
  )
}

export function Team() {
  const sectionRef = useReveal<HTMLElement>()
  const reducedMotion = usePrefersReducedMotion()
  const labelId = useId()
  const [activeIndex, setActiveIndex] = useState(1)
  const [flippedId, setFlippedId] = useState<string | null>(null)
  const dragRef = useRef<{
    pointerId: number | null
    startX: number
    deltaX: number
  }>({ pointerId: null, startX: 0, deltaX: 0 })

  const count = TEAM_MEMBERS.length

  const goTo = useCallback(
    (index: number) => {
      const next = ((index % count) + count) % count
      setActiveIndex(next)
      setFlippedId(null)
    },
    [count],
  )

  const previous = useCallback(() => goTo(activeIndex - 1), [activeIndex, goTo])
  const next = useCallback(() => goTo(activeIndex + 1), [activeIndex, goTo])

  useEffect(() => {
    const onKey = (event: globalThis.KeyboardEvent) => {
      if (event.key === 'Escape') setFlippedId(null)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  const onPointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (event.button !== 0) return
    dragRef.current = {
      pointerId: event.pointerId,
      startX: event.clientX,
      deltaX: 0,
    }
    event.currentTarget.setPointerCapture(event.pointerId)
  }

  const onPointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (dragRef.current.pointerId !== event.pointerId) return
    dragRef.current.deltaX = event.clientX - dragRef.current.startX
  }

  const onPointerUp = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (dragRef.current.pointerId !== event.pointerId) return
    const { deltaX } = dragRef.current
    dragRef.current.pointerId = null
    if (Math.abs(deltaX) < 48) return
    if (deltaX > 0) previous()
    else next()
  }

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'ArrowLeft') {
      event.preventDefault()
      previous()
    }
    if (event.key === 'ArrowRight') {
      event.preventDefault()
      next()
    }
  }

  return (
    <section
      id="team"
      ref={sectionRef}
      aria-labelledby="team-heading"
      className="section-reveal relative overflow-hidden px-5 py-16 sm:px-8 sm:py-24"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(34,211,238,0.08),transparent_55%)]"
      />

      <div className="relative mx-auto w-full max-w-6xl">
        <div className="mb-10 text-center">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-cyan-300/80">
            Meet the team
          </p>
          <h2
            id="team-heading"
            className="font-display text-3xl font-semibold tracking-tight text-white sm:text-4xl"
          >
            Meet the people behind our products.
          </h2>
        </div>

        <div
          role="region"
          aria-roledescription="carousel"
          aria-labelledby={labelId}
          tabIndex={0}
          onKeyDown={onKeyDown}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerUp}
          className="relative touch-pan-y select-none outline-none"
        >
          <p id={labelId} className="sr-only">
            Team profiles. Use previous and next controls, swipe, or left and
            right arrow keys to browse. Activate a card to reveal details.
          </p>

          <div className="relative mx-auto h-[26rem] w-full max-w-5xl overflow-hidden sm:h-[28rem]">
            <div
              aria-hidden="true"
              className="absolute left-[4%] right-[4%] top-10 h-px bg-gradient-to-r from-transparent via-cyan-300/70 to-transparent"
            />
            <div
              aria-hidden="true"
              className="absolute left-[4%] right-[4%] top-[2.35rem] h-[2px] bg-cyan-400/20 blur-[2px]"
            />

            {TEAM_MEMBERS.map((member, index) => {
              let offset = index - activeIndex
              if (offset > count / 2) offset -= count
              if (offset < -count / 2) offset += count

              return (
                <TeamCard
                  key={member.id}
                  member={member}
                  active={index === activeIndex}
                  flipped={flippedId === member.id}
                  offset={offset}
                  reducedMotion={reducedMotion}
                  onActivate={() => {
                    if (index !== activeIndex) {
                      goTo(index)
                      return
                    }
                    setFlippedId((current) =>
                      current === member.id ? null : member.id,
                    )
                  }}
                />
              )
            })}
          </div>

          <div className="mt-4 flex items-center justify-center gap-4 sm:justify-end sm:pr-6">
            <div className="flex items-center gap-2" role="group" aria-label="Team carousel controls">
              <button
                type="button"
                className="grid h-10 w-10 place-items-center rounded-full border border-white/15 text-white transition-colors hover:border-cyan-300/40 hover:text-cyan-200"
                aria-label="Previous team member"
                onClick={previous}
              >
                <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true">
                  <path
                    d="M10 3.5 5.5 8 10 12.5"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    fill="none"
                  />
                </svg>
              </button>
              <button
                type="button"
                className="grid h-10 w-10 place-items-center rounded-full border border-white/15 text-white transition-colors hover:border-cyan-300/40 hover:text-cyan-200"
                aria-label="Next team member"
                onClick={next}
              >
                <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true">
                  <path
                    d="M6 3.5 10.5 8 6 12.5"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    fill="none"
                  />
                </svg>
              </button>
            </div>

            <div className="flex items-center gap-2" role="tablist" aria-label="Team pagination">
              {TEAM_MEMBERS.map((member, index) => (
                <button
                  key={member.id}
                  type="button"
                  role="tab"
                  aria-selected={index === activeIndex}
                  aria-label={`Show profile ${index + 1}`}
                  className={[
                    'h-2.5 rounded-full transition-all',
                    index === activeIndex
                      ? 'w-7 bg-cyan-400'
                      : 'w-2.5 bg-white/25 hover:bg-white/40',
                  ].join(' ')}
                  onClick={() => goTo(index)}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
