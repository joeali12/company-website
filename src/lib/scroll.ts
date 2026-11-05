import type { MouseEvent } from 'react'

let frame = 0
let cancelInput: (() => void) | null = null

function headerOffset() {
  const padding = Number.parseFloat(
    getComputedStyle(document.documentElement).scrollPaddingTop,
  )
  return Number.isFinite(padding) ? padding : 0
}

function destinationFor(id: string) {
  const target = document.getElementById(id)
  if (!target) return null
  const max = Math.max(0, document.documentElement.scrollHeight - window.innerHeight)
  const raw = target.getBoundingClientRect().top + window.scrollY - headerOffset()
  return Math.min(max, Math.max(0, raw))
}

function stopScroll() {
  if (frame) cancelAnimationFrame(frame)
  frame = 0
  cancelInput?.()
  cancelInput = null
}

function easeOutQuint(progress: number) {
  return 1 - (1 - progress) ** 5
}

export function scrollToSection(id: string) {
  const destination = destinationFor(id)
  if (destination == null) return

  const start = window.scrollY
  const distance = destination - start
  stopScroll()

  if (Math.abs(distance) < 2) {
    window.scrollTo({ top: destination, behavior: 'auto' })
    return
  }

  const duration = Math.min(980, Math.max(560, Math.abs(distance) * 0.42))
  const started = performance.now()

  const onUserIntent = () => stopScroll()
  window.addEventListener('wheel', onUserIntent, { passive: true })
  window.addEventListener('touchstart', onUserIntent, { passive: true })
  cancelInput = () => {
    window.removeEventListener('wheel', onUserIntent)
    window.removeEventListener('touchstart', onUserIntent)
  }

  const step = (now: number) => {
    const progress = Math.min(1, (now - started) / duration)
    const next = start + distance * easeOutQuint(progress)
    window.scrollTo({ top: next, behavior: 'auto' })
    if (progress < 1) {
      frame = requestAnimationFrame(step)
      return
    }
    const live = destinationFor(id)
    window.scrollTo({ top: live ?? destination, behavior: 'auto' })
    stopScroll()
  }

  frame = requestAnimationFrame(step)
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
