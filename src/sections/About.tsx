import { useI18n } from '../i18n/context'
import { Section } from '../components/Section'

/** Seção "Sobre mim". */
export function About() {
  const { s, profile } = useI18n()
  return (
    <Section id="sobre" title={s.sections.about}>
      <div className="space-y-4">
        {profile.about.map((paragraph, index) => (
          <p
            key={index}
            className="text-lg leading-relaxed text-neutral-700 dark:text-neutral-300"
          >
            {paragraph}
          </p>
        ))}
      </div>
    </Section>
  )
}
