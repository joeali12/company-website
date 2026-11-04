import { COMPANY_NAME, LEGAL_ENTITY_NAME, NAV_LINKS } from '../data/site'
import { handleNavClick } from '../lib/scroll'

const FOOTER_LINKS = NAV_LINKS.filter((link) => link.id !== 'home')

const COPYRIGHT_YEAR = 2026

export function Footer() {
  return (
    <footer className="border-t border-white/10 bg-navy-900 px-5 pb-8 pt-14 sm:px-8">
      <div className="mx-auto grid w-full max-w-6xl gap-10 md:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <div className="flex items-center gap-2.5">
            <span
              aria-hidden="true"
              className="grid h-8 w-8 place-items-center rounded-lg border border-cyan-400/30 bg-navy-800 text-cyan-300"
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path
                  d="M3 13V3h2.1l2.7 5.1L10.5 3H12.6v10h-1.8V7.4L8.5 12H7L4.8 7.4V13H3z"
                  fill="currentColor"
                />
              </svg>
            </span>
            <span className="font-display text-sm font-semibold text-white">
              {COMPANY_NAME}
            </span>
          </div>
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-slate-soft">
            Building thoughtful digital products for learning and beyond.
          </p>
        </div>

        <div>
          <h2 className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-muted">
            Navigation
          </h2>
          <ul className="mt-4 space-y-2">
            {FOOTER_LINKS.map((link) => (
              <li key={link.id}>
                <a
                  href={`#${link.id}`}
                  onClick={(event) => handleNavClick(event, link.id)}
                  className="text-sm text-slate-soft transition-colors hover:text-white"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h2 className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-muted">
            Legal
          </h2>
          <ul className="mt-4 space-y-2 text-sm text-slate-soft">
            <li>
              <span className="text-slate-muted">
                Privacy Policy — [add when available]
              </span>
            </li>
            <li>
              <span className="text-slate-muted">
                Terms of Service — [add when available]
              </span>
            </li>
          </ul>
        </div>
      </div>

      <div className="mx-auto mt-12 flex w-full max-w-6xl flex-col gap-2 border-t border-white/10 pt-6 text-xs text-slate-muted sm:flex-row sm:items-center sm:justify-between">
        <p>
          © {COPYRIGHT_YEAR} {LEGAL_ENTITY_NAME}. All rights reserved.
        </p>
        <p>Single-page company website</p>
      </div>
    </footer>
  )
}
