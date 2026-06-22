import { profile } from '../data/profile'
import { Section } from '../components/Section'

/** Seção "Sobre mim". */
export function About() {
  return (
    <Section id="sobre" title="Sobre mim">
      <p className="text-lg leading-relaxed text-neutral-700 dark:text-neutral-300">
        {profile.about}
      </p>
    </Section>
  )
}
