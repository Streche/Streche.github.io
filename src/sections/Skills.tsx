import { useI18n } from '../i18n/context'
import { Section } from '../components/Section'
import { Tag } from '../components/Tag'

/** Seção de competências, agrupadas por categoria. */
export function Skills() {
  const { s, profile } = useI18n()
  return (
    <Section id="competencias" title={s.sections.skills}>
      <div className="space-y-6">
        {profile.skills.map((group) => (
          <div key={group.label}>
            <h3 className="mb-3 text-sm font-semibold tracking-wide text-neutral-500 uppercase dark:text-neutral-400">
              {group.label}
            </h3>
            <ul className="flex flex-wrap gap-2">
              {group.items.map((item) => (
                <li key={item}>
                  <Tag>{item}</Tag>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </Section>
  )
}
