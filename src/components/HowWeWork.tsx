import { useReveal } from '../hooks/useReveal'

const STEPS = [
  {
    number: '01',
    title: 'Understand',
    body: 'We start by listening to the people who will use the product.',
  },
  {
    number: '02',
    title: 'Build',
    body: 'We design and develop a focused solution around their needs.',
  },
  {
    number: '03',
    title: 'Improve',
    body: 'We learn from real use and keep making the experience better.',
  },
] as const

export function HowWeWork() {
  const ref = useReveal<HTMLElement>()

  return (
    <section
      ref={ref}
      aria-labelledby="process-heading"
      className="section-reveal relative px-5 py-16 sm:px-8 sm:py-24"
    >
      <div className="mx-auto w-full max-w-6xl">
        <div className="mb-12 max-w-2xl">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-cyan-300/80">
            How we work
          </p>
          <h2
            id="process-heading"
            className="font-display text-3xl font-semibold tracking-tight text-white sm:text-4xl"
          >
            From a real need to a product people can use
          </h2>
          <p className="mt-4 text-base leading-relaxed text-slate-soft sm:text-lg">
            We learn how people work, shape the right solution, and improve it
            through feedback.
          </p>
        </div>

        <ol className="grid gap-5 md:grid-cols-3">
          {STEPS.map((step) => (
            <li
              key={step.number}
              className="surface-card rounded-3xl p-7 transition-transform duration-200 hover:-translate-y-0.5"
            >
              <span className="font-display text-sm font-semibold tracking-[0.18em] text-cyan-300">
                {step.number}
              </span>
              <h3 className="mt-4 font-display text-2xl font-semibold text-white">
                {step.title}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-slate-soft sm:text-base">
                {step.body}
              </p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
