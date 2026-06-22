import { profile } from '../data/profile'
import { Section } from '../components/Section'

/** Seção "Sobre mim". */
export function About() {
  return (
    <Section id="sobre" title="Sobre mim">
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
