import { useI18n } from '../i18n/context'
import { Section } from '../components/Section'

/** Seção "O que eu faço": 4 áreas de atuação, com números grandes. */
export function WhatIDo() {
  const { s, profile } = useI18n()

  return (
    <Section id="faco" title={s.sections.whatIDo}>
      <ul className="divide-y divide-neutral-200 dark:divide-neutral-800">
        {profile.whatIDo.map((item, index) => (
          <li
            key={item.title}
            className="grid gap-2 py-6 sm:grid-cols-[auto_1fr] sm:gap-8"
          >
            <span
              className="text-gradient font-black leading-none"
              style={{ fontSize: 'clamp(2.2rem, 7vw, 4.5rem)' }}
              aria-hidden="true"
            >
              {String(index + 1).padStart(2, '0')}
            </span>
            <div>
              <h3 className="text-lg font-semibold tracking-wide text-neutral-900 uppercase dark:text-neutral-100">
                {item.title}
              </h3>
              <p className="mt-1 max-w-2xl text-neutral-600 dark:text-neutral-400">
                {item.description}
              </p>
            </div>
          </li>
        ))}
      </ul>
    </Section>
  )
}
