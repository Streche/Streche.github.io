import type { Strings } from '../i18n/strings'

export interface Stat {
  value: number
  prefix?: string
  suffix?: string
  labelKey: keyof Strings['stats']
}

/** Métricas curadas e verificáveis exibidas no fim da seção "Sobre". */
export const STATS: Stat[] = [
  { value: 99, labelKey: 'lighthouse' },
  { value: 5, prefix: '+', labelKey: 'years' },
  { value: 15, prefix: '−', suffix: '%', labelKey: 'diagnosis' },
  { value: 20, prefix: '−', suffix: '%', labelKey: 'maintenance' },
]
