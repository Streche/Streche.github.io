import { useEffect, useRef } from 'react'
import { prefersReducedMotion } from '../lib/prefersReducedMotion'

interface MagneticOptions {
  /** Quanto menor, mais o elemento "gruda" no cursor. */
  strength?: number
  /** Distância (px) além da borda do elemento em que o efeito já ativa. */
  padding?: number
}

/**
 * Aproxima um elemento do cursor quando o mouse passa perto dele (hover
 * magnético). Não faz nada (nem registra o listener) se o usuário pediu
 * menos animação, seja pela preferência do sistema ou pelo widget de
 * acessibilidade.
 */
export function useMagnetic<T extends HTMLElement>({
  strength = 3,
  padding = 90,
}: MagneticOptions = {}) {
  const ref = useRef<T>(null)

  useEffect(() => {
    if (prefersReducedMotion()) return
    const el = ref.current
    if (!el) return

    const onMove = (event: MouseEvent) => {
      const rect = el.getBoundingClientRect()
      const cx = rect.left + rect.width / 2
      const cy = rect.top + rect.height / 2
      const dx = event.clientX - cx
      const dy = event.clientY - cy
      const near =
        Math.abs(dx) < rect.width / 2 + padding &&
        Math.abs(dy) < rect.height / 2 + padding

      if (near) {
        el.style.transition = 'transform 0.3s ease-out'
        el.style.transform = `translate(${dx / strength}px, ${dy / strength}px)`
      } else {
        el.style.transition = 'transform 0.6s ease-in-out'
        el.style.transform = 'translate(0, 0)'
      }
    }

    window.addEventListener('mousemove', onMove)
    return () => window.removeEventListener('mousemove', onMove)
  }, [strength, padding])

  return ref
}
