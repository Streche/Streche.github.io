import { useEffect, useRef, useState } from 'react'
import { useI18n } from '../i18n/context'
import { Section } from '../components/Section'
import { prefersReducedMotion } from '../lib/prefersReducedMotion'
import type { SkillGroup } from '../data/profile'

/** Junta os itens de todos os grupos e divide em duas fileiras equilibradas. */
function splitRows(groups: SkillGroup[]): [string[], string[]] {
  const flat = groups.flatMap((group) => group.items)
  const half = Math.ceil(flat.length / 2)
  return [flat.slice(0, half), flat.slice(half)]
}

/**
 * Seção "Competências": duas fileiras de tiles com a stack técnica. Quando o
 * movimento é permitido, cada fileira desliza em sentido oposto conforme a
 * rolagem da página (efeito "marquee"). Com "reduzir animações" (preferência
 * do sistema ou do widget de acessibilidade), vira uma grade estática, sem
 * repetição nem script de rolagem.
 */
export function Skills() {
  const { s, profile } = useI18n()
  const [row1, row2] = splitRows(profile.skills)
  const [animated] = useState(() => !prefersReducedMotion())

  const sectionRef = useRef<HTMLDivElement>(null)
  const row1Ref = useRef<HTMLUListElement>(null)
  const row2Ref = useRef<HTMLUListElement>(null)

  useEffect(() => {
    if (!animated) return
    const onScroll = () => {
      const section = sectionRef.current
      const r1 = row1Ref.current
      const r2 = row2Ref.current
      if (!section || !r1 || !r2) return
      const top = section.offsetTop
      const offset = (window.scrollY - top + window.innerHeight) * 0.2
      r1.style.transform = `translateX(${offset - 260}px)`
      r2.style.transform = `translateX(${-(offset - 260)}px)`
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [animated])

  const rowClass = animated
    ? 'flex flex-nowrap gap-3 will-change-transform'
    : 'flex flex-wrap justify-center gap-3'
  const items1 = animated ? [...row1, ...row1, ...row1] : row1
  const items2 = animated ? [...row2, ...row2, ...row2] : row2

  return (
    <Section id="competencias" title={s.sections.skills}>
      <div ref={sectionRef} className={animated ? 'overflow-x-clip' : ''}>
        <ul ref={row1Ref} className={`${rowClass} mb-3`}>
          {items1.map((item, index) => (
            <li key={`${item}-${index}`} className="tile w-36 shrink-0">
              {item}
            </li>
          ))}
        </ul>
        <ul ref={row2Ref} className={rowClass}>
          {items2.map((item, index) => (
            <li key={`${item}-${index}`} className="tile w-36 shrink-0">
              {item}
            </li>
          ))}
        </ul>
      </div>
    </Section>
  )
}
