import { GAME } from '../constants'

/** Incrementa a pontuação com base no tempo decorrido (dt em segundos). */
export function nextScore(current: number, dt: number): number {
  return current + GAME.scoreRate * dt
}

/**
 * Velocidade atual do jogo: cresce linearmente com o tempo decorrido,
 * limitada a um teto (dificuldade progressiva).
 */
export function currentSpeed(elapsed: number): number {
  const { initial, max, acceleration } = GAME.speed
  return Math.min(max, initial + acceleration * elapsed)
}
