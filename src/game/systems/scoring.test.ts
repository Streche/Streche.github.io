import { nextScore, currentSpeed } from './scoring'
import { GAME } from '../constants'

describe('nextScore', () => {
  it('incrementa proporcional ao tempo decorrido', () => {
    expect(nextScore(0, 1)).toBe(GAME.scoreRate)
    expect(nextScore(10, 0.5)).toBeCloseTo(10 + GAME.scoreRate * 0.5)
  })
})

describe('currentSpeed', () => {
  it('começa na velocidade inicial', () => {
    expect(currentSpeed(0)).toBe(GAME.speed.initial)
  })

  it('cresce com o tempo', () => {
    expect(currentSpeed(5)).toBeGreaterThan(currentSpeed(0))
  })

  it('é limitada ao máximo', () => {
    expect(currentSpeed(100000)).toBe(GAME.speed.max)
  })
})
