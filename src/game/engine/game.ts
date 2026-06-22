import type { GameState, ScoreStorage } from '../types'
import { GAME } from '../constants'
import {
  createPlayer,
  jump,
  updatePlayer,
  playerRect,
  type Player,
} from '../entities/player'
import {
  createObstacle,
  updateObstacle,
  isOffscreen,
  obstacleRect,
  randomHeight,
  randomGap,
  type Obstacle,
} from '../entities/obstacle'
import { intersects } from '../systems/collision'
import { nextScore, currentSpeed } from '../systems/scoring'
import { createScoreStorage } from '../storage'

interface GameOptions {
  storage?: ScoreStorage
  onChange?: (state: GameState) => void
}

/**
 * Orquestra o estado do jogo (máquina de estados idle/running/gameover),
 * delegando a lógica para funções puras testáveis. Mantém o React de fora:
 * comunica mudanças via callback `onChange`.
 */
export class Game {
  private status: GameState['status'] = 'idle'
  private score = 0
  private highScore = 0
  private elapsed = 0
  private distanceToNext = 0
  private player: Player = createPlayer()
  private obstacles: Obstacle[] = []
  private readonly storage: ScoreStorage
  private readonly onChange?: (state: GameState) => void
  private last: GameState

  constructor(options: GameOptions = {}) {
    this.storage = options.storage ?? createScoreStorage()
    this.onChange = options.onChange
    this.highScore = this.storage.load()
    this.last = this.getState()
    this.onChange?.(this.last)
  }

  getState(): GameState {
    return {
      status: this.status,
      score: Math.floor(this.score),
      highScore: this.highScore,
    }
  }

  /** Emite o estado apenas quando algo visível muda (evita re-render a 60fps). */
  private emit(): void {
    const state = this.getState()
    if (
      state.status !== this.last.status ||
      state.score !== this.last.score ||
      state.highScore !== this.last.highScore
    ) {
      this.last = state
      this.onChange?.(state)
    }
  }

  start(): void {
    this.status = 'running'
    this.score = 0
    this.elapsed = 0
    this.player = createPlayer()
    this.obstacles = [createObstacle(randomHeight())]
    this.distanceToNext = randomGap()
    this.emit()
  }

  /** Pula durante o jogo; se estiver parado/fim, (re)inicia a partida. */
  jump(): void {
    if (this.status !== 'running') {
      this.start()
      return
    }
    this.player = jump(this.player)
  }

  update(dt: number): void {
    if (this.status !== 'running') return

    this.elapsed += dt
    const speed = currentSpeed(this.elapsed)
    this.player = updatePlayer(this.player, dt)
    this.score = nextScore(this.score, dt)

    this.obstacles = this.obstacles
      .map((o) => updateObstacle(o, dt, speed))
      .filter((o) => !isOffscreen(o))

    this.distanceToNext -= speed * dt
    if (this.distanceToNext <= 0) {
      this.obstacles.push(createObstacle(randomHeight()))
      this.distanceToNext = randomGap()
    }

    const pr = playerRect(this.player)
    for (const obstacle of this.obstacles) {
      if (intersects(pr, obstacleRect(obstacle))) {
        this.gameOver()
        break
      }
    }

    this.emit()
  }

  private gameOver(): void {
    this.status = 'gameover'
    const final = Math.floor(this.score)
    if (final > this.highScore) {
      this.highScore = final
      this.storage.save(final)
    }
    this.emit()
  }

  render(ctx: CanvasRenderingContext2D): void {
    // Fundo próprio do "viewport" do jogo (consistente em tema claro/escuro).
    ctx.fillStyle = '#fafafa'
    ctx.fillRect(0, 0, GAME.width, GAME.height)

    // Chão.
    ctx.strokeStyle = '#a3a3a3'
    ctx.lineWidth = 2
    ctx.beginPath()
    ctx.moveTo(0, GAME.groundY)
    ctx.lineTo(GAME.width, GAME.groundY)
    ctx.stroke()

    // Jogador.
    ctx.fillStyle = '#171717'
    const pr = playerRect(this.player)
    ctx.fillRect(pr.x, pr.y, pr.width, pr.height)

    // Obstáculos.
    ctx.fillStyle = '#16a34a'
    for (const obstacle of this.obstacles) {
      const r = obstacleRect(obstacle)
      ctx.fillRect(r.x, r.y, r.width, r.height)
    }
  }
}
