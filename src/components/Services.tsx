import type { CSSProperties, PointerEvent } from 'react'
import { useRef, useState } from 'react'
import { SERVICES } from '../data/site'
import { useReveal } from '../hooks/useReveal'

export function Services() {
  const ref = useReveal<HTMLElement>()
  const [tappedId, setTappedId] = useState<string | null>(null)
  const touchStart = useRef<{ x: number; y: number } | null>(null)

  const onPointerDown = (event: PointerEvent<HTMLLIElement>) => {
    if (event.pointerType !== 'touch') return
    touchStart.current = { x: event.clientX, y: event.clientY }
  }

  const onPointerUp = (event: PointerEvent<HTMLLIElement>, id: string) => {
    if (event.pointerType !== 'touch' || !touchStart.current) return
    const dx = Math.abs(event.clientX - touchStart.current.x)
    const dy = Math.abs(event.clientY - touchStart.current.y)
    touchStart.current = null
    if (dx > 12 || dy > 12) return
    setTappedId((current) => (current === id ? null : id))
  }

  return (
    <section
      id="services"
      ref={ref}
      aria-labelledby="services-heading"
      className="section-reveal section-shell"
    >
      <div className="mx-auto w-full max-w-6xl">
        <div className="mb-12 max-w-2xl">
          <p className="hero-brand mb-3 text-xs font-semibold uppercase tracking-[0.18em]">
            Services
          </p>
          <h2
            id="services-heading"
            className="font-display text-3xl font-semibold tracking-tight text-white sm:text-4xl"
          >
            Digital solutions, from systems to websites
          </h2>
          <p className="mt-4 text-base leading-relaxed text-slate-soft sm:text-lg">
            Different goals need different tools. We build software around the
            problem, the people, and the way the solution will be used.
          </p>
        </div>

        <ul className="grid gap-x-5 gap-y-8 sm:grid-cols-2 xl:grid-cols-4">
          {SERVICES.map((service, index) => (
            <li
              key={service.id}
              className={
                tappedId === service.id ? 'service-card is-lit' : 'service-card'
              }
              style={
                { '--service-delay': `${index * 90}ms` } as CSSProperties
              }
              onPointerDown={onPointerDown}
              onPointerUp={(event) => onPointerUp(event, service.id)}
            >
              <div className="service-card-light" aria-hidden="true" />
              <div className="surface-card relative z-10 h-full rounded-3xl p-7 transition-colors duration-200 hover:border-cyan-300/25">
                <span className="font-display text-sm font-semibold tracking-[0.18em] text-cyan-300">
                  {String(index + 1).padStart(2, '0')}
                </span>
                <h3 className="mt-4 font-display text-2xl font-semibold text-white">
                  {service.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-slate-soft sm:text-base">
                  {service.body}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
