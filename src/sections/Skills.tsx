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
 * Seção "Competências": duas faixas horizontais com a stack técnica, cada
 * uma com setas de rolagem lateral e avanço automático que pausa no hover
 * ou no foco do teclado (ver TileCarousel).
 */
export function Skills() {
  const { s, profile } = useI18n()
  const [row1, row2] = splitRows(profile.skills)

  return (
    <Section id="competencias" title={s.sections.skills}>
      <div className="space-y-3">
        <TileCarousel items={row1} ariaLabel={s.sections.skills} />
        <TileCarousel items={row2} ariaLabel={s.sections.skills} reverse />
      </div>
    </Section>
  )
}
