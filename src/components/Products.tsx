import { useReveal } from '../hooks/useReveal'
import { scrollToSection } from '../lib/scroll'
import { EducorePreview } from './EducorePreview'

export function Products() {
  const ref = useReveal<HTMLElement>()

  return (
    <section
      id="products"
      ref={ref}
      aria-labelledby="products-heading"
      className="section-reveal relative px-5 py-16 sm:px-8 sm:py-24"
    >
      <div className="mx-auto w-full max-w-6xl">
        <div className="mb-10 max-w-2xl">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-cyan-300/80">
            Portfolio &amp; tools
          </p>
          <h2
            id="products-heading"
            className="font-display text-3xl font-semibold tracking-tight text-white sm:text-4xl"
          >
            Products made for real needs
          </h2>
          <p className="mt-4 text-base leading-relaxed text-slate-soft sm:text-lg">
            We turn everyday challenges into clear, approachable digital
            experiences.
          </p>
        </div>

        <article className="surface-card overflow-hidden rounded-3xl">
          <div className="grid gap-8 p-7 sm:p-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:gap-10 lg:p-12">
            <div>
              <p className="mb-2 text-xs font-semibold uppercase tracking-[0.16em] text-cyan-300">
                Featured product
              </p>
              <h3 className="font-display text-3xl font-semibold text-white">
                Educore
              </h3>
              <p className="mt-3 text-lg font-medium text-ink/90">
                Learning works better when people stay connected.
              </p>
              <p className="mt-4 max-w-xl text-base leading-relaxed text-slate-soft">
                A digital learning space designed to help students and educators
                stay connected and keep learning activities organized.
              </p>
              <button
                type="button"
                className="btn-primary mt-8 inline-flex"
                onClick={() => scrollToSection('contact')}
              >
                Get in touch about Educore
              </button>
            </div>

            <EducorePreview />
          </div>
        </article>
      </div>
    </section>
  )
}
