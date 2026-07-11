import { useState } from 'react'
import { useI18n } from '../i18n/context'
import { Section } from '../components/Section'

/** Seção "Sobre mim": card com os parágrafos iniciais e "Ver mais" no último. */
export function About() {
  const { s, profile } = useI18n()
  const [expanded, setExpanded] = useState(false)

  const paragraphs = profile.about
  const hasCollapsible = paragraphs.length > 1
  const alwaysVisible = hasCollapsible ? paragraphs.slice(0, -1) : paragraphs
  const collapsible = hasCollapsible
    ? paragraphs[paragraphs.length - 1]
    : undefined
  const extraId = 'sobre-extra'

  const paragraphClass =
    'text-lg leading-relaxed text-neutral-700 dark:text-neutral-300'

  return (
    <Section id="sobre" title={s.sections.about}>
      <div className="rounded-xl border border-neutral-200 p-6 dark:border-neutral-800">
        <div className="space-y-4">
          {alwaysVisible.map((paragraph, index) => (
            <p key={index} className={paragraphClass}>
              {paragraph}
            </p>
          ))}
          {expanded && collapsible && (
            <p id={extraId} className={paragraphClass}>
              {collapsible}
            </p>
          )}
        </div>

        {hasCollapsible && (
          <button
            type="button"
            onClick={() => setExpanded((value) => !value)}
            aria-expanded={expanded}
            aria-controls={extraId}
            className="mt-4 text-sm font-medium text-neutral-900 underline underline-offset-4 transition hover:no-underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-900 dark:text-neutral-100"
          >
            {expanded ? s.about.less : s.about.more}
          </button>
        )}
      </div>
    </Section>
  )
}
