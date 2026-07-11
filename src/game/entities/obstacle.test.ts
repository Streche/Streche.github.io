import {
  createObstacle,
  createWave,
  updateObstacle,
  isOffscreen,
  obstacleRect,
  obstacleWidth,
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
    expect(isOffscreen({ x: -obstacleWidth(30) - 1, height: 30 })).toBe(true)
    expect(isOffscreen({ x: 0, height: 30 })).toBe(false)
  })

  it('largura deriva da altura mantendo o aspecto', () => {
    expect(obstacleWidth(160)).toBe(117)
  })

  it('gera retângulo apoiado no chão', () => {
    const rect = obstacleRect({ x: 100, height: 40 })
    expect(rect).toEqual({
      x: 100,
      y: GAME.groundY - 40,
      width: obstacleWidth(40),
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

describe('createWave', () => {
  it('cria um único cacto quando não é dupla', () => {
    const wave = createWave(false, () => 0.5)
    expect(wave).toHaveLength(1)
  })

  it('cria uma dupla colada e transponível num pulo', () => {
    // rand = 1 => alturas máximas => cactos mais largos (pior caso de largura).
    const wave = createWave(true, () => 1)
    expect(wave).toHaveLength(2)
    const [a, b] = wave
    if (!a || !b) return

    // O segundo cacto nasce logo após o primeiro, separado pelo clusterGap.
    expect(b.x).toBe(a.x + obstacleWidth(a.height) + GAME.obstacle.clusterGap)

    // A dupla é mais estreita que a menor distância aérea possível do pulo,
    // garantindo que sempre dá para transpor os dois de uma vez.
    const span = b.x + obstacleWidth(b.height) - a.x
    const jumpDuration = (2 * Math.abs(GAME.jumpVelocity)) / GAME.gravity
    const minAirborne = GAME.speed.initial * jumpDuration
    expect(span).toBeLessThan(minAirborne)
  })
})
