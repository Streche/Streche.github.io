import {
  createObstacle,
  updateObstacle,
  isOffscreen,
  obstacleRect,
  randomHeight,
  randomGap,
} from './obstacle'
import { GAME } from '../constants'

describe('obstacle', () => {
  it('nasce na borda direita da tela', () => {
    expect(createObstacle(30).x).toBe(GAME.width)
  })

  it('move para a esquerda conforme velocidade e dt', () => {
    const moved = updateObstacle(createObstacle(30), 1, 100)
    expect(moved.x).toBe(GAME.width - 100)
  })

  it('detecta quando saiu da tela pela esquerda', () => {
    expect(isOffscreen({ x: -GAME.obstacle.width - 1, height: 30 })).toBe(true)
    expect(isOffscreen({ x: 0, height: 30 })).toBe(false)
  })

  it('gera retângulo apoiado no chão', () => {
    const rect = obstacleRect({ x: 100, height: 40 })
    expect(rect).toEqual({
      x: 100,
      y: GAME.groundY - 40,
      width: GAME.obstacle.width,
      height: 40,
    })
  })

  it('randomHeight respeita os limites (rand injetável)', () => {
    expect(randomHeight(() => 0)).toBe(GAME.obstacle.minHeight)
    expect(randomHeight(() => 1)).toBe(GAME.obstacle.maxHeight)
  })

  it('randomGap respeita os limites (rand injetável)', () => {
    expect(randomGap(() => 0)).toBe(GAME.obstacle.gapMin)
    expect(randomGap(() => 1)).toBe(GAME.obstacle.gapMax)
  })
})
