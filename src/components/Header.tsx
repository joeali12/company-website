import type { MouseEvent } from 'react'
import { NAV_LINKS } from '../data/site'
import { handleNavClick } from '../lib/scroll'

export function Header() {
  const go = (event: MouseEvent<HTMLAnchorElement>, id: string) => {
    handleNavClick(event, id)
  }

  return (
    <header className="fixed inset-x-0 top-0 z-50 bg-transparent">
      <nav
        aria-label="Primary"
        className="flex h-[var(--header-height)] flex-nowrap items-center justify-start gap-x-1 overflow-x-auto px-3 [scrollbar-width:none] sm:justify-center sm:gap-x-2 sm:overflow-x-visible [&::-webkit-scrollbar]:hidden"
      >
        {NAV_LINKS.map((link) => (
          <a
            key={link.id}
            href={`#${link.id}`}
            onClick={(event) => go(event, link.id)}
            className="shrink-0 rounded-full px-2.5 py-2 text-[0.72rem] font-medium tracking-[0.01em] whitespace-nowrap text-white/80 transition-colors hover:text-white sm:px-3 sm:text-sm"
          >
            {link.label}
          </a>
        ))}
      </nav>
    </header>
  )
}
