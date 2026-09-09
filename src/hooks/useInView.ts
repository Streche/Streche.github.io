import { useCallback, useRef, useState } from 'react'

const OPTIONS: IntersectionObserverInit = {
  threshold: 0.15,
  rootMargin: '0px 0px -10% 0px',
}

/**
 * Observa um elemento e reporta quando ele entra na viewport pela primeira vez.
 * Revela uma vez só: depois de `inView` virar true, o observer é desconectado e
 * o valor não volta atrás. Sem IntersectionObserver (SSR/navegador antigo), o
 * conteúdo é considerado visível imediatamente.
 */
export function useInView<T extends Element = HTMLElement>() {
  const [inView, setInView] = useState(false)
  const observerRef = useRef<IntersectionObserver | null>(null)

  const ref = useCallback((node: T | null) => {
    observerRef.current?.disconnect()
    observerRef.current = null
    if (node === null) return
    if (typeof IntersectionObserver === 'undefined') {
      setInView(true)
      return
    }
    const observer = new IntersectionObserver((entries) => {
      if (entries.some((entry) => entry.isIntersecting)) {
        setInView(true)
        observer.disconnect()
        observerRef.current = null
      }
    }, OPTIONS)
    observer.observe(node)
    observerRef.current = observer
  }, [])

  return { ref, inView }
}
