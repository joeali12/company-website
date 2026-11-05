import { useId, useRef, useState, type FormEvent } from 'react'
import {
  contactHasErrors,
  sendContactMessage,
  validateContact,
  type ContactErrors,
} from '../lib/contact'
import { useReveal } from '../hooks/useReveal'

const fieldClass =
  'w-full rounded-xl border bg-navy-950/70 px-4 py-3 text-base text-ink placeholder:text-slate-muted outline-none transition-[border-color,box-shadow] focus:border-cyan-400/50 focus:shadow-[0_0_0_3px_rgba(34,211,238,0.15)]'

export function Contact() {
  const ref = useReveal<HTMLElement>()
  const nameRef = useRef<HTMLInputElement>(null)
  const emailRef = useRef<HTMLInputElement>(null)
  const messageRef = useRef<HTMLTextAreaElement>(null)
  const nameErrorId = useId()
  const emailErrorId = useId()
  const messageErrorId = useId()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [company, setCompany] = useState('')
  const [errors, setErrors] = useState<ContactErrors>({})
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle')

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const nextErrors = validateContact({ name, email, message, company })
    setErrors(nextErrors)
    if (contactHasErrors(nextErrors)) {
      setStatus('idle')
      if (nextErrors.name) nameRef.current?.focus()
      else if (nextErrors.email) emailRef.current?.focus()
      else messageRef.current?.focus()
      return
    }

    setStatus('sending')
    try {
      await sendContactMessage({ name, email, message, company })
      setName('')
      setEmail('')
      setMessage('')
      setCompany('')
      setErrors({})
      setStatus('sent')
    } catch {
      setStatus('error')
    }
  }

  return (
    <section
      id="contact"
      ref={ref}
      aria-labelledby="contact-heading"
      className="section-reveal section-shell"
    >
      <div className="mx-auto w-full max-w-2xl">
        <div className="mb-8 text-center">
          <p className="hero-brand mb-3 text-sm font-semibold uppercase tracking-[0.18em]">
            Contact
          </p>
          <h2
            id="contact-heading"
            className="font-display text-3xl font-semibold tracking-tight text-white sm:text-4xl"
          >
            Let’s build something useful.
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-slate-soft">
            Tell us what you’re working on and what kind of digital solution you
            need.
          </p>
        </div>

        <div className="surface-card rounded-3xl p-6 sm:p-8">
          {status === 'sent' ? (
            <div className="py-8 text-center" role="status">
              <p className="font-display text-2xl font-semibold text-white">
                Message sent.
              </p>
              <p className="mx-auto mt-3 max-w-md text-base leading-relaxed text-slate-soft">
                Thanks. We’ll reply to the email address you entered.
              </p>
              <button
                type="button"
                className="btn-ghost mt-8"
                onClick={() => setStatus('idle')}
              >
                Send another message
              </button>
            </div>
          ) : (
            <form className="space-y-5" onSubmit={onSubmit} noValidate>
              <div className="absolute -left-[9999px] h-0 w-0 overflow-hidden" aria-hidden="true">
                <label htmlFor="contact-company">Company</label>
                <input
                  id="contact-company"
                  name="company"
                  type="text"
                  tabIndex={-1}
                  autoComplete="off"
                  value={company}
                  onChange={(event) => setCompany(event.target.value)}
                />
              </div>

              <div>
                <label
                  htmlFor="contact-name"
                  className="mb-2 block text-sm font-medium text-ink"
                >
                  Name
                </label>
                <input
                  ref={nameRef}
                  id="contact-name"
                  name="name"
                  type="text"
                  autoComplete="name"
                  placeholder="Your name"
                  value={name}
                  aria-invalid={Boolean(errors.name)}
                  aria-describedby={errors.name ? nameErrorId : undefined}
                  onChange={(event) => {
                    setName(event.target.value)
                    if (errors.name) setErrors((current) => ({ ...current, name: undefined }))
                  }}
                  className={`${fieldClass} ${errors.name ? 'border-rose-300/70' : 'border-white/10'}`}
                />
                {errors.name ? (
                  <p id={nameErrorId} className="mt-2 text-sm text-rose-200">
                    {errors.name}
                  </p>
                ) : null}
              </div>

              <div>
                <label
                  htmlFor="contact-email"
                  className="mb-2 block text-sm font-medium text-ink"
                >
                  Work email
                </label>
                <input
                  ref={emailRef}
                  id="contact-email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  inputMode="email"
                  placeholder="name@company.com"
                  value={email}
                  aria-invalid={Boolean(errors.email)}
                  aria-describedby={errors.email ? emailErrorId : undefined}
                  onChange={(event) => {
                    setEmail(event.target.value)
                    if (errors.email) setErrors((current) => ({ ...current, email: undefined }))
                  }}
                  className={`${fieldClass} ${errors.email ? 'border-rose-300/70' : 'border-white/10'}`}
                />
                {errors.email ? (
                  <p id={emailErrorId} className="mt-2 text-sm text-rose-200">
                    {errors.email}
                  </p>
                ) : null}
              </div>

              <div>
                <label
                  htmlFor="contact-message"
                  className="mb-2 block text-sm font-medium text-ink"
                >
                  What would you like to discuss?
                </label>
                <textarea
                  ref={messageRef}
                  id="contact-message"
                  name="message"
                  rows={5}
                  placeholder="Share a short note about your project or question."
                  value={message}
                  aria-invalid={Boolean(errors.message)}
                  aria-describedby={errors.message ? messageErrorId : undefined}
                  onChange={(event) => {
                    setMessage(event.target.value)
                    if (errors.message) {
                      setErrors((current) => ({ ...current, message: undefined }))
                    }
                  }}
                  className={`${fieldClass} resize-y ${errors.message ? 'border-rose-300/70' : 'border-white/10'}`}
                />
                {errors.message ? (
                  <p id={messageErrorId} className="mt-2 text-sm text-rose-200">
                    {errors.message}
                  </p>
                ) : null}
              </div>

              <button type="submit" className="btn-primary w-full" disabled={status === 'sending'}>
                {status === 'sending' ? 'Sending…' : 'Send message'}
              </button>

              <p
                role="status"
                aria-live="polite"
                className={`text-center text-sm leading-relaxed ${status === 'error' ? 'text-rose-200' : 'text-slate-muted'}`}
              >
                {status === 'error'
                  ? 'We couldn’t send your message. Check your connection and try again.'
                  : 'Messages go directly to the VOLT IQ team.'}
              </p>
            </form>
          )}
        </div>
      </div>
    </section>
  )
}
