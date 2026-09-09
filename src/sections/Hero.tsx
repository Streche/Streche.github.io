import type { CSSProperties } from 'react'
import { useEffect, useState } from 'react'
import { useI18n } from '../i18n/context'
import { ExternalLink } from '../components/ExternalLink'
import { prefersReducedMotion } from '../lib/prefersReducedMotion'

const iconProps = {
  width: 18,
  height: 18,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 2,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
  'aria-hidden': true,
}

function GithubIcon() {
  return (
    <svg {...iconProps}>
      <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
    </svg>
  )
}

function LinkedinIcon() {
  return (
    <svg {...iconProps}>
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
      <rect x="2" y="9" width="4" height="12" />
      <circle cx="4" cy="4" r="2" />
    </svg>
  )
}

/** Seção de abertura: nome, cargo, linha de valor e chamadas para ação. */
export function Hero() {
  const { s, profile, lang } = useI18n()
  const [reduce] = useState(prefersReducedMotion)
  const [shown, setShown] = useState(reduce)

  useEffect(() => {
    if (reduce) return
    const id = requestAnimationFrame(() => setShown(true))
    return () => cancelAnimationFrame(id)
  }, [reduce])

  const item = (
    index: number,
  ): { className: string; style?: CSSProperties } => {
    if (reduce) return { className: '' }
    return {
      className: `reveal${shown ? ' is-visible' : ''}`,
      style: { transitionDelay: `${index * 60}ms` },
    }
  }

  const i0 = item(0)
  const i1 = item(1)
  const i2 = item(2)
  const i3 = item(3)
  const i4 = item(4)

  const primary =
    'rounded-lg bg-neutral-900 px-5 py-2.5 font-medium text-white transition-colors hover:bg-neutral-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-900 dark:bg-neutral-100 dark:text-neutral-900 dark:hover:bg-neutral-300'
  const secondary =
    'rounded-lg border border-neutral-300 px-5 py-2.5 font-medium text-neutral-800 transition-colors hover:bg-neutral-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-900 dark:border-neutral-700 dark:text-neutral-200 dark:hover:bg-neutral-900'
  const icon =
    'flex h-11 w-11 items-center justify-center rounded-lg border border-neutral-300 text-neutral-700 transition-colors hover:bg-neutral-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-900 dark:border-neutral-700 dark:text-neutral-300 dark:hover:bg-neutral-900'

  return (
    <section
      id="inicio"
      className="mx-auto flex min-h-[70svh] w-full max-w-3xl flex-col items-center justify-center px-6 py-20 text-center"
    >
      <h1
        style={i0.style}
        className={`text-4xl font-bold tracking-tight text-neutral-900 sm:text-6xl dark:text-neutral-50 ${i0.className}`}
      >
        {profile.name}
      </h1>
      <p
        style={i1.style}
        className={`mt-4 text-xl text-neutral-700 sm:text-2xl dark:text-neutral-300 ${i1.className}`}
      >
        {profile.role}
      </p>
      <p
        style={i2.style}
        className={`mt-3 max-w-xl text-base text-neutral-600 dark:text-neutral-400 ${i2.className}`}
      >
        {s.hero.tagline}
      </p>
      <p
        style={i3.style}
        className={`mt-2 text-sm text-neutral-500 dark:text-neutral-400 ${i3.className}`}
      >
        {profile.location}
      </p>

      <nav
        style={i4.style}
        aria-label={s.hero.viewProjects}
        className={`mt-8 flex flex-wrap items-center justify-center gap-3 ${i4.className}`}
      >
        <a href="#projetos" className={primary}>
          {s.hero.viewProjects}
        </a>
        <a
          href={`/cv.html?lang=${lang}`}
          target="_blank"
          rel="noopener"
          className={secondary}
        >
          {s.cv}
        </a>
        <a href="#contato" className={secondary}>
          {s.hero.contact}
        </a>
        {profile.contacts.map((contact) => (
          <ExternalLink key={contact.type} href={contact.href} className={icon}>
            {contact.type === 'github' ? <GithubIcon /> : <LinkedinIcon />}
            <span className="sr-only">{contact.label}</span>
          </ExternalLink>
        ))}
      </nav>
    </section>
  )
}
