import { useI18n } from '../i18n/context'
import { Section } from '../components/Section'

/** Seção "Experiência": dois blocos (profissional e formação acadêmica). */
export function Experience() {
  const { s, profile } = useI18n()

  const blockTitle =
    'mb-4 text-sm font-semibold tracking-wide text-neutral-500 uppercase dark:text-neutral-400'
  const card =
    'rounded-xl border border-neutral-200 p-6 dark:border-neutral-800'
  const itemTitle = 'font-semibold text-neutral-900 dark:text-neutral-100'
  const itemMeta = 'mt-1 text-sm text-neutral-500 dark:text-neutral-400'

  return (
    <Section id="experiencia" title={s.sections.experience}>
      <div className="space-y-8">
        <div>
          <h3 className={blockTitle}>{s.experience.work}</h3>
          <ul className="space-y-6">
            {profile.experience.map((item) => (
              <li key={`${item.org}-${item.period}`} className={card}>
                <h4 className={itemTitle}>{item.role}</h4>
                <p className={itemMeta}>
                  {item.org} · {item.period}
                </p>
                <ul className="mt-3 list-disc space-y-1 pl-5 text-neutral-700 dark:text-neutral-300">
                  {item.bullets.map((bullet, index) => (
                    <li key={index}>{bullet}</li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className={blockTitle}>{s.experience.education}</h3>
          <ul className="space-y-3">
            {profile.education.map((item) => (
              <li key={`${item.org}-${item.period}`} className={card}>
                <h4 className={itemTitle}>{item.course}</h4>
                <p className={itemMeta}>
                  {item.org} · {item.period}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Section>
  )
}
