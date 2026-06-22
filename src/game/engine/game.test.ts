import { Game } from './game'
import type { ScoreStorage } from '../types'

/** Storage falso, em memória, que registra o último valor salvo. */
function fakeStorage(initial = 0): ScoreStorage & { saved: number | null } {
  let value = initial
  const store: ScoreStorage & { saved: number | null } = {
    saved: null,
    load: () => value,
    save: (score) => {
      value = score
      store.saved = score
    },
  }
  return store
}

describe('Game', () => {
  it('carrega o recorde do storage e começa em idle', () => {
    const game = new Game({ storage: fakeStorage(50) })
    expect(game.getState()).toEqual({
      status: 'idle',
      score: 0,
      highScore: 50,
    })
  })

  it('start() coloca em running e zera o score', () => {
    const game = new Game({ storage: fakeStorage() })
    game.start()
    expect(game.getState().status).toBe('running')
    expect(game.getState().score).toBe(0)
  })

  it('jump() inicia a partida quando está parado', () => {
    const game = new Game({ storage: fakeStorage() })
    game.jump()
    expect(game.getState().status).toBe('running')
  })

  it('update() não faz nada quando não está rodando', () => {
    const game = new Game({ storage: fakeStorage() })
    game.update(1)
    expect(game.getState()).toEqual({
      status: 'idle',
      score: 0,
      highScore: 0,
    })
  })

  it('acumula pontos enquanto roda', () => {
    const game = new Game({ storage: fakeStorage() })
    game.start()
    game.update(1)
    expect(game.getState().score).toBeGreaterThan(0)
  })

  it('detecta colisão (sem pular), vai para gameover e salva o recorde', () => {
    const storage = fakeStorage()
    const game = new Game({ storage })
    game.start()

    // Sem pular, o jogador no chão acaba colidindo com o primeiro obstáculo.
    let guard = 0
    while (game.getState().status === 'running' && guard < 100_000) {
      game.update(1 / 60)
      guard++
    }

    expect(game.getState().status).toBe('gameover')
    expect(storage.saved).not.toBeNull()
    expect(storage.saved ?? 0).toBeGreaterThan(0)
  })

  it('notifica mudanças via onChange', () => {
    const states: string[] = []
    const game = new Game({
      storage: fakeStorage(),
      onChange: (s) => states.push(s.status),
    })
    game.start()
    expect(states).toContain('idle') // emitido no construtor
    expect(states).toContain('running') // emitido no start
  })
})
