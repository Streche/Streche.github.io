/**
 * Tipos de domínio do mini-game, independentes de React/DOM.
 * Estabelecem o "contrato" da arquitetura usada nas Fases 4 e 5.
 */

/** Vetor 2D (posição, velocidade). */
export interface Vector2 {
  x: number
  y: number
}

/** Retângulo para colisão AABB (axis-aligned bounding box). */
export interface Rect {
  x: number
  y: number
  width: number
  height: number
}

/** Estados possíveis do jogo (máquina de estados simples). */
export type GameStatus = 'idle' | 'running' | 'gameover'

/** Snapshot do estado do jogo em um instante. */
export interface GameState {
  status: GameStatus
  /** Pontuação atual da partida. */
  score: number
  /** Recorde pessoal (carregado do localStorage). */
  highScore: number
}

/** Contrato de persistência do recorde (implementado na Fase 4). */
export interface ScoreStorage {
  load(): number
  save(score: number): void
}
