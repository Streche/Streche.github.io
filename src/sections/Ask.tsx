import { useState } from 'react'
import { useI18n } from '../i18n/context'
import { Section } from '../components/Section'
import { getFaq } from '../data/faq'

/** "Pergunte sobre mim": chat guiado. Cada clique mostra só a pergunta atual. */
export function Ask() {
  const { s, lang } = useI18n()
  const items = getFaq(lang)
  const [selected, setSelected] = useState<string | null>(null)
  const current = items.find((item) => item.id === selected)

  const bubble = 'max-w-[85%] rounded-2xl px-4 py-2'
  const botBubble = `${bubble} bg-neutral-100 text-neutral-700 dark:bg-neutral-800 dark:text-neutral-300`
  const userBubble = `${bubble} bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-900`

  const chipBase =
    'rounded-full border px-3 py-1.5 text-sm transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-900'
  const chipIdle =
    'border-neutral-300 text-neutral-700 hover:bg-neutral-100 dark:border-neutral-700 dark:text-neutral-300 dark:hover:bg-neutral-900'
  const chipActive =
    'border-neutral-900 bg-neutral-900 text-white dark:border-neutral-100 dark:bg-neutral-100 dark:text-neutral-900'

  return (
    <Section id="pergunte" title={s.sections.ask}>
      <div className="rounded-xl border border-neutral-200 p-6 dark:border-neutral-800">
        <div className="flex flex-col gap-3">
          <div className="flex justify-start">
            <p className={botBubble}>{s.ask.intro}</p>
          </div>
          {current && (
            <>
              <div className="flex justify-end">
                <p className={userBubble}>{current.question}</p>
              </div>
              <div className="flex justify-start">
                <p className={botBubble}>{current.answer}</p>
              </div>
            </>
          )}
        </div>

        <ul className="mt-5 flex flex-wrap gap-2">
          {items.map((item) => (
            <li key={item.id}>
              <button
                type="button"
                onClick={() => setSelected(item.id)}
                aria-pressed={item.id === selected}
                className={`${chipBase} ${item.id === selected ? chipActive : chipIdle}`}
              >
                {item.question}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </Section>
  )
}
