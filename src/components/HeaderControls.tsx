import { useTheme } from '../theme/useTheme'
import { useI18n } from '../i18n/context'

const iconProps = {
  width: 18,
  height: 18,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 2,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
  'aria-hidden': true,
}

function SunIcon() {
  return (
    <svg {...iconProps}>
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
    </svg>
  )
}

function MoonIcon() {
  return (
    <svg {...iconProps}>
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
  )
}

function GlobeIcon() {
  return (
    <svg {...iconProps}>
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18" />
    </svg>
  )
}

/** Botões de tema (claro/escuro) e idioma (PT/EN) no cabeçalho. */
export function HeaderControls() {
  const { theme, toggle } = useTheme()
  const { lang, toggleLang, s } = useI18n()

  const base =
    'flex h-9 items-center justify-center gap-1.5 rounded-lg border border-neutral-300 px-2.5 text-sm font-medium text-neutral-700 transition-colors hover:bg-neutral-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-900 dark:border-neutral-700 dark:text-neutral-200 dark:hover:bg-neutral-900'

  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        onClick={toggle}
        aria-label={s.controls.theme}
        title={s.controls.theme}
        className={`${base} w-9`}
      >
        {theme === 'dark' ? <SunIcon /> : <MoonIcon />}
      </button>

      <button
        type="button"
        onClick={toggleLang}
        aria-label={s.controls.language}
        title={s.controls.language}
        className={base}
      >
        <GlobeIcon />
        <span>{lang === 'pt' ? 'EN' : 'PT'}</span>
      </button>
    </div>
  )
}
