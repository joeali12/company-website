import { useReveal } from '../hooks/useReveal'
import { scrollToSection } from '../lib/scroll'

export function CompanyIntro() {
  const ref = useReveal<HTMLElement>()

  return (
    <section
      id="about"
      ref={ref}
      aria-labelledby="about-heading"
      className="section-reveal section-shell"
    >
      <div className="surface-card mx-auto grid w-full max-w-6xl gap-8 rounded-3xl p-7 sm:p-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:gap-12 lg:p-12">
        <div>
          <p className="hero-brand mb-3 text-sm font-semibold uppercase tracking-[0.18em]">
            About VOLT IQ
          </p>
          <h2
            id="about-heading"
            className="font-display text-3xl font-semibold tracking-tight text-white sm:text-4xl"
          >
            Software that helps move your ideas forward.
          </h2>
        </div>

        <aside className="rounded-2xl border border-white/10 bg-navy-950/55 p-6">
          <p className="text-sm leading-relaxed text-slate-soft sm:text-base">
            VOLT IQ is a full-service software company creating digital
            solutions for a wide range of needs. We work across ERP systems,
            SaaS products, and websites, shaping each solution around the people
            who will use it.
          </p>
          <button
            type="button"
            className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-cyan-300 transition-colors hover:text-cyan-200"
            onClick={() => scrollToSection('services')}
          >
            See our services
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
