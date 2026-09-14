import { useI18n } from '../i18n/context'
import { Section } from '../components/Section'
import { TileCarousel } from '../components/TileCarousel'
import type { SkillGroup } from '../data/profile'

/** Junta os itens de todos os grupos e divide em duas fileiras equilibradas. */
function splitRows(groups: SkillGroup[]): [string[], string[]] {
  const flat = groups.flatMap((group) => group.items)
  const half = Math.ceil(flat.length / 2)
  return [flat.slice(0, half), flat.slice(half)]
}

/**
 * Seção "Competências": uma única faixa com duas linhas empilhadas da
 * stack técnica, um par de setas controlando as duas juntas, e caixas de
 * tamanho único (sem quebrar linha) via TileCarousel.
 */
export function Skills() {
  const { s, profile } = useI18n()
  const [row1, row2] = splitRows(profile.skills)

  return (
    <Section id="competencias" title={s.sections.skills}>
      <div className="full-bleed px-4 sm:px-6">
        <TileCarousel
          rows={[row1, row2]}
          ariaLabel={s.sections.skills}
          nowrap
        />
      </div>
    </Section>
  )
}
