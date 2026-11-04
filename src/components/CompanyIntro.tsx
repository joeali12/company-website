import { useReveal } from '../hooks/useReveal'
import { scrollToSection } from '../lib/scroll'

export function CompanyIntro() {
  const ref = useReveal<HTMLElement>()

  return (
    <section
      id="about"
      ref={ref}
      aria-labelledby="about-heading"
      className="section-reveal relative px-5 py-16 sm:px-8 sm:py-24"
    >
      <div className="surface-card mx-auto grid w-full max-w-6xl gap-8 rounded-3xl p-7 sm:p-10 lg:grid-cols-[1.2fr_0.8fr] lg:items-center lg:gap-12 lg:p-12">
        <div>
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-cyan-300/80">
            About
          </p>
          <h2
            id="about-heading"
            className="font-display text-3xl font-semibold tracking-tight text-white sm:text-4xl"
          >
            Technology should make useful things easier.
          </h2>
        </div>

        <aside className="rounded-2xl border border-white/10 bg-navy-950/55 p-6">
          <h3 className="font-display text-sm font-semibold uppercase tracking-[0.14em] text-slate-soft">
            Our core philosophy
          </h3>
          <p className="mt-3 text-sm leading-relaxed text-slate-soft sm:text-base">
            We focus on the needs behind the product, making thoughtful choices
            and creating digital experiences that are clear and useful.
          </p>
          <button
            type="button"
            className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-cyan-300 transition-colors hover:text-cyan-200"
            onClick={() => scrollToSection('products')}
          >
            Learn more
            <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true">
              <path
                d="M3 7h7M7 3.5 10.5 7 7 10.5"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </aside>
      </div>
    </section>
  )
}
