import { profile } from '../data/profile'
import { Section } from '../components/Section'
import { ExternalLink } from '../components/ExternalLink'

/** Seção de contato com os links do perfil. */
export function Contact() {
  return (
    <Section id="contato" title="Contato">
      <p className="mb-4 text-lg text-neutral-700 dark:text-neutral-300">
        Vamos conversar? Me encontre nestes canais:
      </p>
      <ul className="flex flex-wrap gap-3">
        {profile.contacts.map((contact) => (
          <li key={contact.type}>
            <ExternalLink
              href={contact.href}
              className="inline-flex rounded-lg border border-neutral-300 px-5 py-2.5 font-medium text-neutral-800 transition-colors hover:bg-neutral-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-900 dark:border-neutral-700 dark:text-neutral-200 dark:hover:bg-neutral-900"
            >
              {contact.label}
            </ExternalLink>
          </li>
        ))}
      </ul>
    </Section>
  )
}
