import { useEffect, useId, useState, type MouseEvent } from 'react'
import { COMPANY_NAME, NAV_LINKS } from '../data/site'
import { handleNavClick, scrollToSection } from '../lib/scroll'

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const menuId = useId()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    if (!menuOpen) return

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setMenuOpen(false)
    }

    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', onKeyDown)
    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', onKeyDown)
    }
  }, [menuOpen])

  const go = (event: MouseEvent<HTMLAnchorElement>, id: string) => {
    handleNavClick(event, id)
    setMenuOpen(false)
  }

  return (
    <header
      className={[
        'fixed inset-x-0 top-0 z-50 border-b transition-[background,border-color,backdrop-filter] duration-200',
        scrolled || menuOpen
          ? 'border-white/10 bg-navy-950/90 backdrop-blur-xl'
          : 'border-transparent bg-transparent',
      ].join(' ')}
    >
      <div className="mx-auto flex h-[var(--header-height)] w-full max-w-6xl items-center justify-between gap-4 px-5 sm:px-8">
        <a
          href="#home"
          className="group flex min-w-0 items-center gap-2.5"
          onClick={(event) => go(event, 'home')}
        >
          <span
            aria-hidden="true"
            className="grid h-8 w-8 shrink-0 place-items-center rounded-lg border border-cyan-400/30 bg-navy-800 text-cyan-300 shadow-[0_0_18px_rgba(34,211,238,0.18)]"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path
                d="M3 13V3h2.1l2.7 5.1L10.5 3H12.6v10h-1.8V7.4L8.5 12H7L4.8 7.4V13H3z"
                fill="currentColor"
              />
            </svg>
          </span>
          <span className="truncate font-display text-sm font-semibold tracking-wide text-white sm:text-[0.95rem]">
            {COMPANY_NAME}
          </span>
        </a>

        <nav
          aria-label="Primary"
          className="hidden items-center gap-1 md:flex"
        >
          {NAV_LINKS.map((link) => (
            <a
              key={link.id}
              href={`#${link.id}`}
              onClick={(event) => go(event, link.id)}
              className="rounded-full px-3.5 py-2 text-sm font-medium text-slate-soft transition-colors hover:text-white"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <button
            type="button"
            className="btn-primary hidden px-4 py-2.5 text-sm md:inline-flex"
            onClick={() => scrollToSection('products')}
          >
            Explore our products
          </button>

          <button
            type="button"
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/15 text-white md:hidden"
            aria-expanded={menuOpen}
            aria-controls={menuOpen ? menuId : undefined}
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            onClick={() => setMenuOpen((open) => !open)}
          >
            <span className="sr-only">{menuOpen ? 'Close' : 'Menu'}</span>
            <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
              {menuOpen ? (
                <path
                  d="M4 4l10 10M14 4L4 14"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                />
              ) : (
                <path
                  d="M3 5h12M3 9h12M3 13h12"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                />
              )}
            </svg>
          </button>
        </div>
      </div>

      {menuOpen ? (
        <div
          id={menuId}
          className="border-t border-white/10 bg-navy-950/95 px-5 pb-5 pt-3 backdrop-blur-xl md:hidden"
        >
          <nav aria-label="Mobile" className="flex flex-col gap-1">
            {NAV_LINKS.map((link) => (
              <a
                key={link.id}
                href={`#${link.id}`}
                onClick={(event) => go(event, link.id)}
                className="rounded-xl px-3 py-3 text-base font-medium text-ink hover:bg-white/5"
              >
                {link.label}
              </a>
            ))}
            <button
              type="button"
              className="btn-primary mt-2 inline-flex w-full"
              onClick={() => {
                setMenuOpen(false)
                scrollToSection('products')
              }}
            >
              Explore our products
            </button>
          </nav>
        </div>
      ) : null}
    </header>
  )
}
