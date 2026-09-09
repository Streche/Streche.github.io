import { useState } from 'react'
import { useI18n } from '../i18n/context'
import { Section } from '../components/Section'
import { useInView } from '../hooks/useInView'
import { useCountUp } from '../hooks/useCountUp'
import { STATS, type Stat } from '../data/stats'

function StatItem({ stat, active }: { stat: Stat; active: boolean }) {
  const { s } = useI18n()
  const count = useCountUp(stat.value, active)
  return (
    <li className="text-center">
      <p
        aria-hidden="true"
        className="text-3xl font-bold tabular-nums text-neutral-900 dark:text-neutral-100"
      >
        {stat.prefix}
        {count}
        {stat.suffix}
      </p>
      <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
        {s.stats[stat.labelKey]}
      </p>
      <span className="sr-only">
        {stat.prefix}
        {stat.value}
        {stat.suffix} {s.stats[stat.labelKey]}
      </span>
    </li>
  )
}

/** Seção "Sobre mim": card com os parágrafos iniciais e uma faixa de números. */
export function About() {
  const { s, profile } = useI18n()
  const [expanded, setExpanded] = useState(false)
  const { ref: statsRef, inView: statsInView } = useInView<HTMLUListElement>()

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

      <ul ref={statsRef} className="mt-8 grid grid-cols-2 gap-6 sm:grid-cols-4">
        {STATS.map((stat) => (
          <StatItem key={stat.labelKey} stat={stat} active={statsInView} />
        ))}
      </ul>
    </Section>
  )
}
