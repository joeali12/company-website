import type { MouseEvent } from 'react'

export function scrollToSection(id: string) {
  const target = document.getElementById(id)
  if (!target) return

  target.scrollIntoView({
    behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches
      ? 'auto'
      : 'smooth',
    block: 'start',
  })
}

export function handleNavClick(
  event: MouseEvent<HTMLAnchorElement>,
  id: string,
) {
  event.preventDefault()
  scrollToSection(id)

  if (window.history.replaceState) {
    window.history.replaceState(null, '', `#${id}`)
  }
}
