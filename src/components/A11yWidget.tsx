import { useEffect, useState } from 'react'
import { useI18n } from '../i18n/context'

interface A11yPrefs {
  fontScale: number
  contrast: boolean
  links: boolean
  spacing: boolean
  reduceMotion: boolean
}

const DEFAULTS: A11yPrefs = {
  fontScale: 1,
  contrast: false,
  links: false,
  spacing: false,
  reduceMotion: false,
}
const KEY = 'a11y'
const FONT_MIN = 0.9
const FONT_MAX = 1.4
const FONT_STEP = 0.1

function loadPrefs(): A11yPrefs {
  try {
    const raw = localStorage.getItem(KEY)
    if (raw) return { ...DEFAULTS, ...JSON.parse(raw) }
  } catch {
    /* localStorage indisponível */
  }
  return DEFAULTS
}

/** Aplica as preferências na raiz do documento (classes + escala de fonte). */
function applyPrefs(prefs: A11yPrefs): void {
  const el = document.documentElement
  el.style.fontSize =
    prefs.fontScale === 1 ? '' : `${Math.round(prefs.fontScale * 100)}%`
  el.classList.toggle('a11y-contrast', prefs.contrast)
  el.classList.toggle('a11y-links', prefs.links)
  el.classList.toggle('a11y-spacing', prefs.spacing)
  el.classList.toggle('a11y-reduce-motion', prefs.reduceMotion)
}

const iconProps = {
  width: 24,
  height: 24,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 2,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
  'aria-hidden': true,
}

function A11yIcon() {
  return (
    <svg {...iconProps}>
      <circle cx="12" cy="4" r="2" fill="currentColor" stroke="none" />
      <path d="M5 9c4 1.6 10 1.6 14 0" />
      <path d="M12 8v5" />
      <path d="M8.5 21l3.5-8 3.5 8" />
    </svg>
  )
}

/** Botão fixo de acessibilidade: fonte, contraste, links, espaçamento e movimento. */
export function A11yWidget() {
  const { s } = useI18n()
  const a = s.a11y
  const [open, setOpen] = useState(false)
  const [prefs, setPrefs] = useState<A11yPrefs>(loadPrefs)

  useEffect(() => {
    applyPrefs(prefs)
    try {
      localStorage.setItem(KEY, JSON.stringify(prefs))
    } catch {
      /* localStorage indisponível */
    }
  }, [prefs])

  const setFont = (delta: number) =>
    setPrefs((p) => ({
      ...p,
      fontScale: Math.min(
        FONT_MAX,
        Math.max(FONT_MIN, Math.round((p.fontScale + delta) * 10) / 10),
      ),
    }))
  const toggle = (key: 'contrast' | 'links' | 'spacing' | 'reduceMotion') =>
    setPrefs((p) => ({ ...p, [key]: !p[key] }))
  const reset = () => setPrefs(DEFAULTS)

  const stepBtn =
    'flex-1 rounded-lg border border-neutral-300 py-1.5 text-neutral-700 transition-colors hover:bg-neutral-100 dark:border-neutral-700 dark:text-neutral-300 dark:hover:bg-neutral-900'
  const toggleBtn = (active: boolean) =>
    `w-full rounded-lg border px-3 py-2 text-left text-sm transition-colors ${
      active
        ? 'border-neutral-900 bg-neutral-900 text-white dark:border-neutral-100 dark:bg-neutral-100 dark:text-neutral-900'
        : 'border-neutral-300 text-neutral-700 hover:bg-neutral-100 dark:border-neutral-700 dark:text-neutral-300 dark:hover:bg-neutral-900'
    }`

  return (
    <div className="fixed bottom-6 left-6 z-50 print:hidden">
      {open && (
        <div
          role="dialog"
          aria-label={a.title}
          className="mb-3 w-64 rounded-xl border border-neutral-200 bg-white p-4 shadow-lg dark:border-neutral-800 dark:bg-neutral-950"
        >
          <p className="mb-3 text-sm font-semibold text-neutral-900 dark:text-neutral-100">
            {a.title}
          </p>

          <div className="mb-3">
            <span className="mb-1 block text-xs text-neutral-500 dark:text-neutral-400">
              {a.fontSize}
            </span>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setFont(-FONT_STEP)}
                aria-label={a.decrease}
                className={stepBtn}
              >
                A-
              </button>
              <button
                type="button"
                onClick={() => setFont(FONT_STEP)}
                aria-label={a.increase}
                className={stepBtn}
              >
                A+
              </button>
            </div>
          </div>

          <div className="space-y-2">
            <button
              type="button"
              onClick={() => toggle('contrast')}
              aria-pressed={prefs.contrast}
              className={toggleBtn(prefs.contrast)}
            >
              {a.contrast}
            </button>
            <button
              type="button"
              onClick={() => toggle('links')}
              aria-pressed={prefs.links}
              className={toggleBtn(prefs.links)}
            >
              {a.links}
            </button>
            <button
              type="button"
              onClick={() => toggle('spacing')}
              aria-pressed={prefs.spacing}
              className={toggleBtn(prefs.spacing)}
            >
              {a.spacing}
            </button>
            <button
              type="button"
              onClick={() => toggle('reduceMotion')}
              aria-pressed={prefs.reduceMotion}
              className={toggleBtn(prefs.reduceMotion)}
            >
              {a.motion}
            </button>
          </div>

          <button
            type="button"
            onClick={reset}
            className="mt-3 text-sm font-medium text-neutral-600 underline underline-offset-4 hover:no-underline dark:text-neutral-400"
          >
            {a.reset}
          </button>
        </div>
      )}

      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-label={a.title}
        aria-expanded={open}
        className="flex h-12 w-12 items-center justify-center rounded-full border border-neutral-300 bg-white text-neutral-800 shadow-lg transition-colors hover:bg-neutral-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-900 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-100 dark:hover:bg-neutral-800"
      >
        <A11yIcon />
      </button>
    </div>
  )
}
