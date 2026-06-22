import { useCallback, useEffect, useRef, useState } from 'react'
import type { RefObject } from 'react'
import { Game } from '../game/engine/game'
import { createLoop } from '../game/engine/loop'
import type { GameState } from '../game/types'

/**
 * Liga o motor do jogo a um <canvas>: cria o loop, trata input de teclado
 * e expõe o estado (status/score/highScore) e a ação `jump` para a UI.
 */
export function useGame(canvasRef: RefObject<HTMLCanvasElement | null>) {
  const [state, setState] = useState<GameState>({
    status: 'idle',
    score: 0,
    highScore: 0,
  })
  const gameRef = useRef<Game | null>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const game = new Game({ onChange: setState })
    gameRef.current = game

    const loop = createLoop((dt) => {
      game.update(dt)
      game.render(ctx)
    })
    game.render(ctx)
    loop.start()

    // Teclas que rolam a página — bloqueadas enquanto o jogo está rodando
    // para "travar a tela" durante a partida.
    const scrollKeys = new Set([
      'Space',
      'ArrowUp',
      'ArrowDown',
      'ArrowLeft',
      'ArrowRight',
      'PageUp',
      'PageDown',
      'Home',
      'End',
    ])

    const onKeyDown = (event: KeyboardEvent) => {
      // Só intercepta o teclado durante a partida (não atrapalha o resto do site).
      if (game.getState().status !== 'running') return
      if (scrollKeys.has(event.code)) {
        event.preventDefault()
      }
      if (event.code === 'Space' || event.code === 'ArrowUp') {
        game.jump()
      }
    }
    window.addEventListener('keydown', onKeyDown)

    return () => {
      loop.stop()
      window.removeEventListener('keydown', onKeyDown)
      gameRef.current = null
    }
  }, [canvasRef])

  const jump = useCallback(() => {
    gameRef.current?.jump()
  }, [])

  return { state, jump }
}
