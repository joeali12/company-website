import { scrollToSection } from '../lib/scroll'

export function Hero() {
  return (
    <section
      id="home"
      aria-labelledby="hero-heading"
      className="relative overflow-hidden pt-[calc(var(--header-height)+2.5rem)] pb-20 sm:pb-28"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
      >
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(34,211,238,0.16),transparent_55%),radial-gradient(ellipse_at_80%_20%,rgba(59,130,246,0.18),transparent_45%),linear-gradient(180deg,#0b1220_0%,#060b16_100%)]" />
        <div className="absolute inset-x-0 top-24 mx-auto h-[28rem] w-[28rem] rounded-full bg-cyan-400/10 blur-[100px]" />
        <div
          className="absolute inset-0 opacity-[0.35]"
          style={{
            backgroundImage:
              'linear-gradient(rgba(148,163,184,0.07) 1px, transparent 1px), linear-gradient(90deg, rgba(148,163,184,0.07) 1px, transparent 1px)',
            backgroundSize: '72px 72px',
            maskImage:
              'radial-gradient(ellipse at center, black 20%, transparent 72%)',
          }}
        />
      </div>

      <div className="relative mx-auto flex w-full max-w-4xl flex-col items-center px-5 text-center sm:px-8">
        <p className="mb-6 inline-flex items-center rounded-full border border-cyan-400/25 bg-cyan-400/10 px-3.5 py-1.5 text-xs font-semibold tracking-wide text-cyan-300 shadow-[0_0_24px_rgba(34,211,238,0.12)] sm:text-sm">
          Focused on human-centered digital experiences
        </p>

        <h1
          id="hero-heading"
          className="font-display text-[2.05rem] font-semibold leading-[1.12] tracking-tight text-white sm:text-5xl md:text-[3.35rem]"
        >
          We build digital products that bring people closer to{' '}
          <span className="text-gradient-cyan [text-shadow:0_0_40px_rgba(34,211,238,0.35)]">
            what they need.
          </span>
        </h1>

        <p className="mt-6 max-w-2xl text-base leading-relaxed text-slate-soft sm:text-lg">
          We create useful, thoughtful technology for learning, collaboration,
          and everyday progress.
        </p>

        <div className="mt-9 flex flex-col items-stretch gap-3 sm:flex-row sm:items-center">
          <button
            type="button"
            className="btn-primary inline-flex"
            onClick={() => scrollToSection('products')}
          >
            Explore our products
            <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true">
              <path
                d="M3 8h9M8.5 4.5 12 8l-3.5 3.5"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
          <button
            type="button"
            className="btn-ghost inline-flex"
            onClick={() => scrollToSection('contact')}
          >
            <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true">
              <path
                d="M3 4.5h10v7H3v-7Zm0 0 5 3.5 5-3.5"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinejoin="round"
                fill="none"
              />
            </svg>
            Talk to our team
          </button>
        </div>
      </div>
    </section>
  )
}
