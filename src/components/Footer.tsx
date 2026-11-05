import type { MouseEvent } from 'react'
import { COMPANY_NAME, NAV_LINKS } from '../data/site'
import { handleNavClick } from '../lib/scroll'

const FOOTER_LINKS = NAV_LINKS.filter((link) => link.id !== 'home')

const COPYRIGHT_YEAR = 2026

export function Footer() {
  const go = (event: MouseEvent<HTMLAnchorElement>, id: string) => {
    handleNavClick(event, id)
  }

  return (
    <footer className="border-t border-white/10 bg-navy-950 px-5 py-16 sm:px-8 sm:py-20">
      <div className="mx-auto w-full max-w-6xl">
        <div className="grid border border-white/10 md:grid-cols-12">
          <nav
            aria-label="Footer"
            className="border-b border-white/10 md:col-span-5 md:border-r md:border-b-0"
          >
            <p className="px-6 pt-6 text-[0.68rem] font-semibold uppercase tracking-[0.22em] text-cyan-300/80 sm:px-8 sm:pt-8">
              Index
            </p>
            <ol className="mt-4">
              {FOOTER_LINKS.map((link, index) => (
                <li key={link.id} className="border-t border-white/10">
                  <a
                    href={`#${link.id}`}
                    onClick={(event) => go(event, link.id)}
                    className="flex min-h-12 cursor-pointer items-center justify-between gap-4 px-6 py-3 transition-colors duration-200 hover:bg-white/[0.03] sm:px-8"
                  >
                    <span className="font-display text-base font-medium text-white">
                      {link.label}
                    </span>
                    <span className="font-display text-xs tracking-[0.18em] text-cyan-300/70">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                  </a>
                </li>
              ))}
            </ol>
          </nav>

          <div className="flex flex-col justify-between gap-10 px-6 py-8 sm:px-8 sm:py-10 md:col-span-7 md:px-12">
            <p className="max-w-xl font-display text-2xl font-semibold leading-snug tracking-[-0.03em] text-white sm:text-3xl">
              {COMPANY_NAME} builds digital solutions for people and businesses,
              including ERP systems, SaaS products, and websites.
            </p>
            <p className="text-xs tracking-[0.16em] text-slate-muted uppercase">
              © {COPYRIGHT_YEAR} {COMPANY_NAME}
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}
