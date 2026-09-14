import { useEffect, useState } from 'react'

/**
 * Retorna o id da seção "ativa" (a que está no terço superior da viewport).
 * Entre várias visíveis, escolhe a primeira na ordem de `ids`.
 */
export function useScrollSpy(ids: readonly string[]): string {
  const [activeId, setActiveId] = useState('')
  // Chave estável pelo conteúdo de `ids`: um consumidor que passe um array
  // literal novo a cada render não recria o observer (nem zera o Set `visible`).
  const idsKey = ids.join(',')

  useEffect(() => {
    if (typeof IntersectionObserver === 'undefined') return
    const watched = idsKey ? idsKey.split(',') : []
    const visible = new Set<string>()
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) visible.add(entry.target.id)
          else visible.delete(entry.target.id)
        }
        const firstVisible = watched.find((id) => visible.has(id))
        if (firstVisible) setActiveId(firstVisible)
      },
      { rootMargin: '-45% 0px -50% 0px' },
    )
    for (const id of watched) {
      const element = document.getElementById(id)
      if (element) observer.observe(element)
    }
    return () => observer.disconnect()
  }, [idsKey])

  return activeId
}
