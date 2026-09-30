import { useI18n } from '../i18n/context'
import { Section } from '../components/Section'

/** Seção "Experiência": dois blocos (profissional e formação acadêmica). */
export function Experience() {
  const { s, profile } = useI18n()

  const blockTitle =
    'mb-4 text-sm font-semibold tracking-wide text-neutral-500 uppercase dark:text-neutral-400'
  const itemMeta = 'mt-1 text-sm text-neutral-500 dark:text-neutral-400'
  const num = 'text-gradient shrink-0 font-black leading-none'
  const numStyle = { fontSize: 'clamp(1.8rem, 5vw, 3rem)' }

  return (
    <Section id="experiencia" title={s.sections.experience}>
      <div className="space-y-10">
        <div>
          <h3 className={blockTitle}>{s.experience.work}</h3>
          <ul className="space-y-6">
            {profile.experience.map((item, index) => (
              <li
                key={`${item.org}-${item.period}`}
                className="flex gap-4 border-t border-neutral-200 pt-6 first:border-t-0 first:pt-0 dark:border-neutral-800"
              >
                <span className={num} style={numStyle} aria-hidden="true">
                  {String(index + 1).padStart(2, '0')}
                </span>
                <div>
                  <h4 className="font-semibold text-neutral-900 dark:text-neutral-100">
                    {item.role}
                  </h4>
                  <p className={itemMeta}>
                    {item.org} · {item.period}
                  </p>
                  <ul className="mt-3 list-disc space-y-1 pl-5 text-neutral-700 dark:text-neutral-300">
                    {item.bullets.map((bullet, bulletIndex) => (
                      <li key={bulletIndex}>{bullet}</li>
                    ))}
                  </ul>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className={blockTitle}>{s.experience.education}</h3>
          <ul className="space-y-3">
            {profile.education.map((item) => (
              <li
                key={`${item.org}-${item.period}`}
                className="rounded-xl border border-neutral-200 p-4 dark:border-neutral-800"
              >
                <h4 className="font-semibold text-neutral-900 dark:text-neutral-100">
                  {item.course}
                </h4>
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
