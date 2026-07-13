import { useCallback, useEffect, useRef, useState } from 'react'
import type { RefObject } from 'react'
import type { Game } from '../game/engine/game'
import type { Loop } from '../game/engine/loop'
import type { GameState } from '../game/types'

const SCROLL_KEYS = new Set([
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

/**
 * Liga o motor do jogo a um <canvas>: cria o loop, trata input de teclado
 * e expõe o estado (status/score/highScore) e a ação `jump` para a UI.
 * O motor é carregado sob demanda (code-splitting), aliviando o JS inicial da
 * página; o loop só roda enquanto a partida está em andamento.
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

    let cancelled = false
    let cleanup: (() => void) | undefined

    void Promise.all([
      import('../game/engine/game'),
      import('../game/engine/loop'),
      import('../game/assets'),
    ]).then(([gameMod, loopMod, assetsMod]) => {
      if (cancelled) return

      const assets = assetsMod.loadGameAssets()
      const game = new gameMod.Game({ onChange: setState, assets })
      gameRef.current = game

      const loop = loopMod.createLoop((dt) => {
        game.update(dt)
        game.render(ctx)
      })
      loopRef.current = loop
      game.render(ctx) // desenha o frame inicial (tela "idle")

      // Redesenha quando cada imagem terminar de carregar (a tela inicial é estática).
      for (const image of Object.values(assets)) {
        image.addEventListener('load', () => game.render(ctx), { once: true })
      }

      // Teclas que rolam a página — bloqueadas enquanto o jogo está rodando.
      const onKeyDown = (event: KeyboardEvent) => {
        if (game.getState().status !== 'running') return
        if (SCROLL_KEYS.has(event.code)) event.preventDefault()
        if (event.code === 'Space' || event.code === 'ArrowUp') game.jump()
      }
      window.addEventListener('keydown', onKeyDown)

      // Caso o status já esteja em 'running' quando o motor terminar de carregar.
      if (game.getState().status === 'running') loop.start()

      cleanup = () => {
        loop.stop()
        window.removeEventListener('keydown', onKeyDown)
        gameRef.current = null
        loopRef.current = null
      }
    })

    return () => {
      cancelled = true
      cleanup?.()
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
