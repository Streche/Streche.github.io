import { useCallback, useEffect, useState } from 'react'
import type { ReactNode } from 'react'
import { strings, HTML_LANG, type Lang } from './strings'
import { getProfile } from '../data/profile'
import { I18nContext, type I18nValue } from './context'

const STORAGE_KEY = 'lang'

function initialLang(): Lang {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored === 'pt' || stored === 'en') return stored
  } catch {
    /* localStorage indisponível */
  }
  return 'pt'
}

function persist(lang: Lang): void {
  try {
    localStorage.setItem(STORAGE_KEY, lang)
  } catch {
    /* localStorage indisponível */
  }
}

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(initialLang)

  const setLang = useCallback((next: Lang) => {
    setLangState(next)
    persist(next)
  }, [])

  const toggleLang = useCallback(() => {
    setLangState((prev) => {
      const next: Lang = prev === 'pt' ? 'en' : 'pt'
      persist(next)
      return next
    })
  }, [])

  useEffect(() => {
    document.documentElement.lang = HTML_LANG[lang]
  }, [lang])

  const value: I18nValue = {
    lang,
    setLang,
    toggleLang,
    s: strings[lang],
    profile: getProfile(lang),
  }

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>
}
