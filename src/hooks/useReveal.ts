import { useEffect, useRef } from 'react'
import { usePrefersReducedMotion } from './usePrefersReducedMotion'

export function useReveal<T extends HTMLElement>() {
  const ref = useRef<T | null>(null)
  const reducedMotion = usePrefersReducedMotion()

  useEffect(() => {
    const node = ref.current
    if (!node) return

    if (reducedMotion) {
      node.classList.add('is-visible')
      return
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          node.classList.add('is-visible')
          observer.unobserve(node)
        }
      },
      { threshold: 0.14, rootMargin: '0px 0px -8% 0px' },
    )

    observer.observe(node)
    return () => observer.disconnect()
  }, [reducedMotion])

  return ref
}
