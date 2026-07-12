import { getCv } from '../data/cv'
import type { Lang } from '../i18n/strings'

const labels = {
  pt: {
    download: 'Baixar PDF',
    summary: 'Resumo profissional',
    experience: 'Experiência profissional',
    education: 'Formação acadêmica',
    skills: 'Competências',
    languages: 'Idiomas',
    highlights: 'Destaques',
  },
  en: {
    download: 'Download PDF',
    summary: 'Professional summary',
    experience: 'Professional experience',
    education: 'Education',
    skills: 'Skills',
    languages: 'Languages',
    highlights: 'Highlights',
  },
} as const

/** Currículo em uma página A4, gerado dos dados do site (PT/EN). */
export function CV({ lang }: { lang: Lang }) {
  const cv = getCv(lang)
  const t = labels[lang]
  const sectionTitle =
    'mb-2 border-b border-neutral-300 pb-1 text-sm font-bold tracking-wide text-neutral-800 uppercase'

  return (
    <main className="mx-auto max-w-3xl bg-white px-10 py-10 text-neutral-900">
      <div className="mb-6 flex justify-end print:hidden">
        <button
          type="button"
          onClick={() => window.print()}
          className="rounded-lg bg-neutral-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-neutral-700"
        >
          {t.download}
        </button>
      </div>

      <header className="mb-6">
        <h1 className="text-2xl font-bold">{cv.fullName}</h1>
        <p className="mt-1 text-neutral-700">{cv.role}</p>
        <p className="mt-1 text-sm text-neutral-500">
          {cv.location} · {cv.email}
        </p>
      </header>

      <section className="mb-5">
        <h2 className={sectionTitle}>{t.summary}</h2>
        <p className="text-sm leading-relaxed text-neutral-700">{cv.summary}</p>
      </section>

      <section className="mb-5">
        <h2 className={sectionTitle}>{t.experience}</h2>
        <ul className="space-y-3">
          {cv.experience.map((item) => (
            <li key={`${item.org}-${item.period}`}>
              <p className="font-semibold">{item.role}</p>
              <p className="text-sm text-neutral-500">
                {item.org} · {item.period}
              </p>
              <ul className="mt-1 list-disc space-y-0.5 pl-5 text-sm text-neutral-700">
                {item.bullets.map((bullet, index) => (
                  <li key={index}>{bullet}</li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      </section>

      <section className="mb-5">
        <h2 className={sectionTitle}>{t.education}</h2>
        <ul className="space-y-1 text-sm">
          {cv.education.map((item) => (
            <li key={`${item.org}-${item.period}`}>
              <span className="font-semibold">{item.course}</span>
              <span className="text-neutral-500">
                {' '}
                · {item.org} · {item.period}
              </span>
            </li>
          ))}
        </ul>
      </section>

      <section className="mb-5">
        <h2 className={sectionTitle}>{t.skills}</h2>
        <ul className="space-y-1 text-sm text-neutral-700">
          {cv.skills.map((group) => (
            <li key={group.label}>
              <span className="font-semibold text-neutral-900">
                {group.label}:
              </span>{' '}
              {group.items.join(', ')}
            </li>
          ))}
        </ul>
      </section>

      <div className="flex gap-10">
        <section className="flex-1">
          <h2 className={sectionTitle}>{t.languages}</h2>
          <ul className="list-disc space-y-0.5 pl-5 text-sm text-neutral-700">
            {cv.languages.map((language) => (
              <li key={language}>{language}</li>
            ))}
          </ul>
        </section>
        <section className="flex-1">
          <h2 className={sectionTitle}>{t.highlights}</h2>
          <ul className="list-disc space-y-0.5 pl-5 text-sm text-neutral-700">
            {cv.highlights.map((highlight) => (
              <li key={highlight}>{highlight}</li>
            ))}
          </ul>
        </section>
      </div>
    </main>
  )
}
