import { useState } from 'react'
import { useI18n } from '../i18n/context'
import { Section } from '../components/Section'
import { getFaq, type FaqItem } from '../data/faq'

/** "Pergunte sobre mim": chat guiado (click-para-perguntar), 100% estático. */
export function Ask() {
  const { s, lang } = useI18n()
  const items = getFaq(lang)
  const [asked, setAsked] = useState<string[]>([])

  const askedItems = asked
    .map((id) => items.find((item) => item.id === id))
    .filter((item): item is FaqItem => Boolean(item))
  const remaining = items.filter((item) => !asked.includes(item.id))

  const bubble = 'max-w-[85%] rounded-2xl px-4 py-2'
  const botBubble = `${bubble} bg-neutral-100 text-neutral-700 dark:bg-neutral-800 dark:text-neutral-300`
  const userBubble = `${bubble} bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-900`

  return (
    <Section id="pergunte" title={s.sections.ask}>
      <div className="rounded-xl border border-neutral-200 p-6 dark:border-neutral-800">
        <div className="flex flex-col gap-3">
          <div className="flex justify-start">
            <p className={botBubble}>{s.ask.intro}</p>
          </div>
          {askedItems.map((item) => (
            <div key={item.id} className="flex flex-col gap-3">
              <div className="flex justify-end">
                <p className={userBubble}>{item.question}</p>
              </div>
              <div className="flex justify-start">
                <p className={botBubble}>{item.answer}</p>
              </div>
            </div>
          ))}
        </div>

        {remaining.length > 0 && (
          <ul className="mt-5 flex flex-wrap gap-2">
            {remaining.map((item) => (
              <li key={item.id}>
                <button
                  type="button"
                  onClick={() => setAsked((current) => [...current, item.id])}
                  className="rounded-full border border-neutral-300 px-3 py-1.5 text-sm text-neutral-700 transition-colors hover:bg-neutral-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-900 dark:border-neutral-700 dark:text-neutral-300 dark:hover:bg-neutral-900"
                >
                  {item.question}
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </Section>
  )
}
