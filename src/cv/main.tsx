import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './cv.css'
import { CV } from './CV'
import type { Lang } from '../i18n/strings'

const param = new URLSearchParams(window.location.search).get('lang')
const lang: Lang = param === 'en' ? 'en' : 'pt'
document.documentElement.lang = lang === 'en' ? 'en-US' : 'pt-BR'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <CV lang={lang} />
  </StrictMode>,
)
