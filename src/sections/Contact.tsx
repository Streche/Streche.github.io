import { useI18n } from '../i18n/context'
import { Section } from '../components/Section'
import { ExternalLink } from '../components/ExternalLink'

/** Seção de contato com os links do perfil. */
export function Contact() {
  const { s, profile, lang } = useI18n()
  const pill =
    'inline-flex rounded-full border-2 border-neutral-300 px-6 py-2.5 font-medium tracking-wide text-neutral-800 uppercase transition-colors hover:bg-neutral-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-900 dark:border-neutral-600 dark:text-neutral-200 dark:hover:bg-neutral-800'

  return (
    <Section id="contato" title={s.sections.contact}>
      <p className="mb-4 text-lg text-neutral-700 dark:text-neutral-300">
        {s.contact.intro}
      </p>
      <ul className="flex flex-wrap gap-3">
        <li>
          <a
            href={`/cv.html?lang=${lang}`}
            target="_blank"
            rel="noopener"
            className={pill}
          >
            {s.cv}
          </a>
        </li>
        {profile.contacts.map((contact) => (
          <li key={contact.type}>
            <ExternalLink href={contact.href} className={pill}>
              {contact.label}
            </ExternalLink>
          </li>
        ))}
      </ul>
    </Section>
  )
}
