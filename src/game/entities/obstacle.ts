import type { Rect } from '../types'
import { GAME } from '../constants'

export interface Obstacle {
  /** Posição x da borda esquerda. */
  x: number
  height: number
}

export function createObstacle(height: number): Obstacle {
  return { x: GAME.width, height }
}

/** Move o obstáculo para a esquerda conforme a velocidade do jogo. */
export function updateObstacle(
  obstacle: Obstacle,
  dt: number,
  speed: number,
): Obstacle {
  return { ...obstacle, x: obstacle.x - speed * dt }
}

/** Largura do obstáculo derivada da altura, mantendo o aspecto do sprite. */
export function obstacleWidth(height: number): number {
  return Math.round(height * GAME.obstacle.aspect)
}

/** Verdadeiro quando o obstáculo saiu completamente da tela pela esquerda. */
export function isOffscreen(obstacle: Obstacle): boolean {
  return obstacle.x + obstacleWidth(obstacle.height) < 0
}

export function obstacleRect(obstacle: Obstacle): Rect {
  return {
    x: obstacle.x,
    y: GAME.groundY - obstacle.height,
    width: obstacleWidth(obstacle.height),
    height: obstacle.height,
  }
}

/** Altura aleatória dentro dos limites (rand injetável para testes). */
export function randomHeight(rand: () => number = Math.random): number {
  const { minHeight, maxHeight } = GAME.obstacle
  return Math.round(minHeight + rand() * (maxHeight - minHeight))
}

/** Distância aleatória até o próximo obstáculo (rand injetável para testes). */
export function randomGap(rand: () => number = Math.random): number {
  const { gapMin, gapMax } = GAME.obstacle
  return gapMin + rand() * (gapMax - gapMin)
}
