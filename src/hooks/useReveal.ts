import { useEffect, useRef } from 'react'

export function useReveal<T extends HTMLElement>() {
  const ref = useRef<T | null>(null)

  useEffect(() => {
    const node = ref.current
    if (!node) return

    if (typeof IntersectionObserver === 'undefined') {
      node.classList.add('is-visible')
      return
    }

    let observer: IntersectionObserver
    try {
      observer = new IntersectionObserver(
        ([entry]) => {
          if (entry?.isIntersecting) {
            node.classList.add('is-visible')
            observer.unobserve(node)
          }
        },
        { threshold: 0.14, rootMargin: '0px 0px -8% 0px' },
      )
    } catch {
      node.classList.add('is-visible')
      return
    }

    observer.observe(node)
    return () => observer.disconnect()
  }, [])

  return ref
}
