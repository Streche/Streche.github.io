import { createContext, useContext } from 'react'
import { strings, type Lang, type Strings } from './strings'
import { getProfile, type Profile } from '../data/profile'

export interface I18nValue {
  lang: Lang
  setLang: (lang: Lang) => void
  toggleLang: () => void
  s: Strings
  profile: Profile
}

export const I18nContext = createContext<I18nValue>({
  lang: 'pt',
  setLang: () => {},
  toggleLang: () => {},
  s: strings.pt,
  profile: getProfile('pt'),
})

export function useI18n(): I18nValue {
  return useContext(I18nContext)
}
