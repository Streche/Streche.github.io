import { useCallback, useEffect, useRef, useState } from 'react'
import type { RefObject } from 'react'
import { Game } from '../game/engine/game'
import { createLoop } from '../game/engine/loop'
import type { Loop } from '../game/engine/loop'
import type { GameState } from '../game/types'

/**
 * Liga o motor do jogo a um <canvas>: cria o loop, trata input de teclado
 * e expõe o estado (status/score/highScore) e a ação `jump` para a UI.
 * O loop só roda enquanto a partida está em andamento (economia de bateria).
 */
export function useGame(canvasRef: RefObject<HTMLCanvasElement | null>) {
  const [state, setState] = useState<GameState>({
    status: 'idle',
    score: 0,
    highScore: 0,
  })
  const gameRef = useRef<Game | null>(null)
  const loopRef = useRef<Loop | null>(null)

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
    loopRef.current = loop
    game.render(ctx) // desenha o frame inicial (tela "idle")

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
      loopRef.current = null
    }
  }, [canvasRef])

  // Liga/desliga o loop conforme o status: roda só durante a partida.
  useEffect(() => {
    const loop = loopRef.current
    if (!loop) return
    if (state.status === 'running') {
      loop.start()
    } else {
      loop.stop()
    }
  }, [state.status])

  const jump = useCallback(() => {
    gameRef.current?.jump()
  }, [])

  return { state, jump }
}
