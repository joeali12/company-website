import { useReveal } from '../hooks/useReveal'
import { scrollToSection } from '../lib/scroll'
import { EducorePreview } from './EducorePreview'

export function Products() {
  const ref = useReveal<HTMLElement>()

  return (
    <section
      id="projects"
      ref={ref}
      aria-labelledby="projects-heading"
      className="section-reveal section-shell"
    >
      <div className="mx-auto w-full max-w-6xl">
        <div className="mb-10 max-w-2xl">
          <p className="hero-brand mb-3 text-sm font-semibold uppercase tracking-[0.18em]">
            Projects
          </p>
          <h2
            id="projects-heading"
            className="font-display text-3xl font-semibold tracking-tight text-white sm:text-4xl"
          >
            Our first project
          </h2>
        </div>

        <article className="surface-card stagger-item overflow-hidden rounded-3xl">
          <div className="grid gap-8 p-7 sm:p-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:gap-10 lg:p-12">
            <div>
              <p className="mb-2 text-xs font-semibold uppercase tracking-[0.16em] text-cyan-300">
                Education platform
              </p>
              <h3 className="font-display text-3xl font-semibold text-white">
                EduCore
              </h3>
              <p className="mt-4 max-w-xl text-base leading-relaxed text-slate-soft">
                EduCore is our first project: an education platform designed to
                bring learning operations and teaching tools into one connected
                workspace.
              </p>
              <p className="mt-4 max-w-xl text-base leading-relaxed text-slate-soft">
                We’re building EduCore around the needs of teachers and learning
                communities, with a focus on keeping learning activities and
                information organized.
              </p>
              <button
                type="button"
                className="btn-primary mt-8"
                onClick={() => scrollToSection('contact')}
              >
                Discuss a project
              </button>
            </div>

            <EducorePreview />
          </div>
        </article>
      </div>
    </section>
  )
}
