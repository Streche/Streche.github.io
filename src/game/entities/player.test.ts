import { createPlayer, jump, updatePlayer, playerRect } from './player'
import { GAME } from '../constants'

const groundTop = GAME.groundY - GAME.player.height

describe('player', () => {
  it('começa no chão, parado', () => {
    const player = createPlayer()
    expect(player.onGround).toBe(true)
    expect(player.vy).toBe(0)
    expect(player.y).toBe(groundTop)
  })

  it('pula quando está no chão', () => {
    const player = jump(createPlayer())
    expect(player.onGround).toBe(false)
    expect(player.vy).toBe(GAME.jumpVelocity)
  })

  it('não pula duas vezes no ar (sem double jump)', () => {
    const airborne = jump(createPlayer())
    const again = jump(airborne)
    expect(again).toEqual(airborne)
  })

  it('aplica gravidade ao subir', () => {
    const airborne = jump(createPlayer())
    const after = updatePlayer(airborne, 0.1)
    // Subindo, mas a gravidade já reduziu a velocidade (vy menos negativa).
    expect(after.vy).toBeGreaterThan(airborne.vy)
    expect(after.y).toBeLessThan(groundTop)
  })

  it('aterrissa e fica preso no chão', () => {
    // Um dt grande deve trazer o jogador de volta ao chão.
    const airborne = jump(createPlayer())
    const landed = updatePlayer(airborne, 5)
    expect(landed.onGround).toBe(true)
    expect(landed.y).toBe(groundTop)
    expect(landed.vy).toBe(0)
  })

  it('gera um retângulo de colisão coerente', () => {
    const rect = playerRect(createPlayer())
    expect(rect).toEqual({
      x: GAME.player.x,
      y: groundTop,
      width: GAME.player.width,
      height: GAME.player.height,
    })
  })
})
