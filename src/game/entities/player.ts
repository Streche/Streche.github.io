import type { Rect } from '../types'
import { GAME } from '../constants'

export interface Player {
  /** Posição do topo do jogador (y). */
  y: number
  /** Velocidade vertical. */
  vy: number
  onGround: boolean
}

/** Posição do topo quando o jogador está no chão. */
const groundTop = GAME.groundY - GAME.player.height

export function createPlayer(): Player {
  return { y: groundTop, vy: 0, onGround: true }
}

/** Aplica o pulo somente se o jogador estiver no chão. */
export function jump(player: Player): Player {
  if (!player.onGround) return player
  return { ...player, vy: GAME.jumpVelocity, onGround: false }
}

/** Atualiza a física do jogador (gravidade + colisão com o chão). */
export function updatePlayer(player: Player, dt: number): Player {
  const vy = player.vy + GAME.gravity * dt
  const y = player.y + vy * dt

  if (y >= groundTop) {
    return { y: groundTop, vy: 0, onGround: true }
  }
  return { y, vy, onGround: false }
}

export function playerRect(player: Player): Rect {
  return {
    x: GAME.player.x,
    y: player.y,
    width: GAME.player.width,
    height: GAME.player.height,
  }
}
