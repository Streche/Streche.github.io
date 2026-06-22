import { useCallback, useState } from 'react'

export type Theme = 'light' | 'dark'

function currentTheme(): Theme {
  if (typeof document === 'undefined') return 'light'
  return document.documentElement.classList.contains('dark') ? 'dark' : 'light'
}

/**
 * Tema claro/escuro com persistência. O estado inicial vem da classe já
 * aplicada pelo /theme.js (sem flash). O toggle atualiza a classe `.dark`
 * no <html> e salva a preferência no localStorage.
 */
export function useTheme() {
  const [theme, setTheme] = useState<Theme>(currentTheme)

  const toggle = useCallback(() => {
    setTheme((prev) => {
      const next: Theme = prev === 'dark' ? 'light' : 'dark'
      document.documentElement.classList.toggle('dark', next === 'dark')
      try {
        localStorage.setItem('theme', next)
      } catch {
        /* localStorage indisponível — ignora */
      }
      return next
    })
  }, [])

  return { theme, toggle }
}
