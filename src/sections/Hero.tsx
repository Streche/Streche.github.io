import { useI18n } from '../i18n/context'
import { ExternalLink } from '../components/ExternalLink'

/** Seção de abertura: nome, cargo, localização e chamadas para ação. */
export function Hero() {
  const { s, profile } = useI18n()
  return (
    <section
      id="inicio"
      className="mx-auto flex min-h-[70svh] w-full max-w-3xl flex-col items-center justify-center px-6 py-20 text-center"
    >
      <h1 className="text-4xl font-bold tracking-tight text-neutral-900 sm:text-6xl dark:text-neutral-50">
        {profile.name}
      </h1>
      <p className="mt-4 text-xl text-neutral-700 sm:text-2xl dark:text-neutral-300">
        {profile.role}
      </p>
      <p className="mt-2 text-sm text-neutral-500 dark:text-neutral-400">
        {profile.location}
      </p>

      <nav
        aria-label={s.hero.viewProjects}
        className="mt-8 flex flex-wrap items-center justify-center gap-3"
      >
        <a
          href="#projetos"
          className="rounded-lg bg-neutral-900 px-5 py-2.5 font-medium text-white transition-colors hover:bg-neutral-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-900 dark:bg-neutral-100 dark:text-neutral-900 dark:hover:bg-neutral-300"
        >
          {s.hero.viewProjects}
        </a>
        <a
          href="#contato"
          className="rounded-lg border border-neutral-300 px-5 py-2.5 font-medium text-neutral-800 transition-colors hover:bg-neutral-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-900 dark:border-neutral-700 dark:text-neutral-200 dark:hover:bg-neutral-900"
        >
          {s.hero.contact}
        </a>
        {profile.contacts.map((contact) => (
          <ExternalLink
            key={contact.type}
            href={contact.href}
            className="rounded-lg border border-neutral-300 px-5 py-2.5 font-medium text-neutral-800 transition-colors hover:bg-neutral-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-900 dark:border-neutral-700 dark:text-neutral-200 dark:hover:bg-neutral-900"
          >
            {contact.label}
          </ExternalLink>
        ))}
      </nav>
    </section>
  )
}
