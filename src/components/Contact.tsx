import { useState, type FormEvent } from 'react'
import { useReveal } from '../hooks/useReveal'

export function Contact() {
  const ref = useReveal<HTMLElement>()
  const [status, setStatus] = useState<'idle' | 'prototype'>('idle')

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setStatus('prototype')
  }

  return (
    <section
      id="contact"
      ref={ref}
      aria-labelledby="contact-heading"
      className="section-reveal relative px-5 py-16 sm:px-8 sm:py-24"
    >
      <div className="mx-auto w-full max-w-2xl">
        <div className="mb-8 text-center">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-cyan-300/80">
            Contact
          </p>
          <h2
            id="contact-heading"
            className="font-display text-3xl font-semibold tracking-tight text-white sm:text-4xl"
          >
            Let’s talk about what you’re building.
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-slate-soft">
            Whether you have a question about Educore, want to explore working
            with us, or simply want to say hello, we’d be glad to hear from you.
          </p>
        </div>

        <div className="surface-card rounded-3xl p-6 sm:p-8">
          <form className="space-y-5" onSubmit={onSubmit} noValidate>
            <div>
              <label
                htmlFor="contact-name"
                className="mb-2 block text-sm font-medium text-ink"
              >
                Name
              </label>
              <input
                id="contact-name"
                name="name"
                type="text"
                autoComplete="name"
                placeholder="[Your name]"
                required
                className="w-full rounded-xl border border-white/10 bg-navy-950/70 px-4 py-3 text-ink placeholder:text-slate-muted outline-none transition-[border-color,box-shadow] focus:border-cyan-400/50 focus:shadow-[0_0_0_3px_rgba(34,211,238,0.15)]"
              />
            </div>

            <div>
              <label
                htmlFor="contact-email"
                className="mb-2 block text-sm font-medium text-ink"
              >
                Work email
              </label>
              <input
                id="contact-email"
                name="email"
                type="email"
                autoComplete="email"
                inputMode="email"
                placeholder="name@company.com"
                required
                className="w-full rounded-xl border border-white/10 bg-navy-950/70 px-4 py-3 text-ink placeholder:text-slate-muted outline-none transition-[border-color,box-shadow] focus:border-cyan-400/50 focus:shadow-[0_0_0_3px_rgba(34,211,238,0.15)]"
              />
            </div>

            <div>
              <label
                htmlFor="contact-message"
                className="mb-2 block text-sm font-medium text-ink"
              >
                What would you like to discuss?
              </label>
              <textarea
                id="contact-message"
                name="message"
                rows={5}
                required
                placeholder="Share a short note about your question or project."
                className="w-full resize-y rounded-xl border border-white/10 bg-navy-950/70 px-4 py-3 text-ink placeholder:text-slate-muted outline-none transition-[border-color,box-shadow] focus:border-cyan-400/50 focus:shadow-[0_0_0_3px_rgba(34,211,238,0.15)]"
              />
            </div>

            <button type="submit" className="btn-primary inline-flex w-full">
              Send message
            </button>

            <p
              role="status"
              aria-live="polite"
              className="text-center text-sm leading-relaxed text-slate-muted"
            >
              {status === 'prototype'
                ? 'This contact form is a prototype and is not connected to a backend yet. Your message was not sent.'
                : 'Prototype form — submissions are not delivered until a destination is configured.'}
            </p>
          </form>
        </div>
      </div>
    </section>
  )
}
