import type { GameState, ScoreStorage, Rect } from '../types'
import { GAME } from '../constants'
import type { GameAssets } from '../assets'
import { isReady } from '../assets'
import {
  createPlayer,
  jump,
  updatePlayer,
  playerRect,
  type Player,
} from '../entities/player'
import {
  createObstacle,
  createWave,
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
  assets?: GameAssets
}

/** Encolhe um retângulo (margem) para deixar a colisão mais justa. */
function shrink(rect: Rect, dx: number, dy: number): Rect {
  return {
    x: rect.x + dx,
    y: rect.y + dy,
    width: Math.max(0, rect.width - dx * 2),
    height: Math.max(0, rect.height - dy),
  }
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
  private readonly assets?: GameAssets
  private last: GameState

  constructor(options: GameOptions = {}) {
    this.storage = options.storage ?? createScoreStorage()
    this.onChange = options.onChange
    this.assets = options.assets
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

  /** Quantidade de obstáculos atualmente na tela (observabilidade/testes). */
  obstacleCount(): number {
    return this.obstacles.length
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

    // Uma leva por vez: só conta o intervalo para a próxima quando a tela está
    // livre (a leva anterior já saiu). A leva pode ser um cacto ou uma dupla.
    if (this.obstacles.length === 0) {
      this.distanceToNext -= speed * dt
      if (this.distanceToNext <= 0) {
        const double = Math.random() < this.doubleChance()
        this.obstacles.push(...createWave(double))
        this.distanceToNext = randomGap()
      }
    }

    // Colisão com margem (os sprites têm transparência nas bordas).
    const pr = shrink(playerRect(this.player), 5, 6)
    for (const obstacle of this.obstacles) {
      const r = obstacleRect(obstacle)
      const hit = shrink(
        r,
        Math.round(r.width * 0.2),
        Math.round(r.height * 0.06),
      )
      if (intersects(pr, hit)) {
        this.gameOver()
        break
      }
    }

    this.emit()
  }

  /** Escolhe o sprite do jogador conforme o estado/animação. */
  private playerSprite(): HTMLImageElement | undefined {
    const a = this.assets
    if (!a) return undefined
    if (this.status === 'gameover') return a.playerHurt
    if (this.status === 'idle') return a.playerStand
    if (!this.player.onGround) return a.playerJump
    // Ciclo de corrida: alterna os dois quadros ao longo do tempo.
    return Math.floor(this.elapsed * 9) % 2 === 0
      ? a.playerWalk1
      : a.playerWalk2
  }

  /**
   * Chance de a próxima leva ser uma dupla de cactos: zero nos primeiros
   * segundos e crescendo com o tempo de jogo, até um teto de 45%.
   */
  private doubleChance(): number {
    return Math.min(0.45, Math.max(0, (this.elapsed - 6) / 60))
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
    const a = this.assets

    // Fundo (céu).
    if (a && isReady(a.background)) {
      ctx.drawImage(a.background, 0, 0, GAME.width, GAME.height)
    } else {
      ctx.fillStyle = '#bfe9ff'
      ctx.fillRect(0, 0, GAME.width, GAME.height)
    }

    // Chão (tiles de grama com rolagem).
    if (a && isReady(a.ground)) {
      const bandH = GAME.height - GAME.groundY + 24
      const tileW = Math.round(
        (bandH * a.ground.naturalWidth) / a.ground.naturalHeight,
      )
      const offset = (this.elapsed * 140) % tileW
      for (let x = -offset; x < GAME.width; x += tileW) {
        ctx.drawImage(a.ground, x, GAME.groundY, tileW, bandH)
      }
    } else {
      ctx.strokeStyle = '#a3a3a3'
      ctx.lineWidth = 2
      ctx.beginPath()
      ctx.moveTo(0, GAME.groundY)
      ctx.lineTo(GAME.width, GAME.groundY)
      ctx.stroke()
    }

    // Jogador (sprite animado, alinhado pela base ao hitbox).
    const hb = playerRect(this.player)
    const sprite = this.playerSprite()
    if (a && sprite && isReady(sprite)) {
      const targetH = 60
      const drawW = (targetH * sprite.naturalWidth) / sprite.naturalHeight
      ctx.drawImage(
        sprite,
        hb.x + hb.width / 2 - drawW / 2,
        hb.y + hb.height - targetH,
        drawW,
        targetH,
      )
    } else {
      ctx.fillStyle = '#171717'
      ctx.fillRect(hb.x, hb.y, hb.width, hb.height)
    }

    // Obstáculos (cacto).
    for (const obstacle of this.obstacles) {
      const r = obstacleRect(obstacle)
      if (a && isReady(a.cactus)) {
        ctx.drawImage(a.cactus, r.x, r.y, r.width, r.height)
      } else {
        ctx.fillStyle = '#16a34a'
        ctx.fillRect(r.x, r.y, r.width, r.height)
      }
    }
  }
}
