import { STATS } from './stats'
import { strings } from '../i18n/strings'

describe('STATS', () => {
  it('tem 4 métricas com valores e labels válidos', () => {
    expect(STATS).toHaveLength(4)
    for (const stat of STATS) {
      expect(typeof stat.value).toBe('number')
      expect(strings.pt.stats[stat.labelKey]).toBeTruthy()
      expect(strings.en.stats[stat.labelKey]).toBeTruthy()
    }
  })

  it('inclui a métrica do Lighthouse e as reduções de tempo', () => {
    const values = STATS.map(
      (stat) => `${stat.prefix ?? ''}${stat.value}${stat.suffix ?? ''}`,
    )
    expect(values).toEqual(['100', '+5', '−15%', '−20%'])
  })
})
