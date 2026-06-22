import { useRef } from 'react'
import { Section } from '../components/Section'
import { useGame } from '../hooks/useGame'
import { GAME } from '../game/constants'

/** Seção do mini-game 2D (endless-runner) com recorde pessoal. */
export function Game() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const { state, jump } = useGame(canvasRef)

  const overlayMessage =
    state.status === 'idle'
      ? 'Clique ou pressione espaço para começar'
      : `Fim de jogo! Você fez ${state.score} ponto${state.score === 1 ? '' : 's'}.`

  return (
    <Section id="jogo" title="Mini-game">
      <p className="mb-4 text-neutral-700 dark:text-neutral-300">
        Desvie dos obstáculos! Pressione <kbd>espaço</kbd> / <kbd>↑</kbd> ou
        toque na tela para pular.
      </p>

      <div
        className="mb-3 flex justify-between font-mono text-sm text-neutral-700 dark:text-neutral-300"
        aria-live="polite"
      >
        <span>Pontos: {state.score}</span>
        <span>Recorde: {state.highScore}</span>
      </div>

      <div className="relative">
        <canvas
          ref={canvasRef}
          width={GAME.width}
          height={GAME.height}
          onPointerDown={jump}
          role="img"
          aria-label="Mini-game: pule para desviar dos obstáculos"
          className="h-auto w-full touch-none rounded-lg border border-neutral-300 dark:border-neutral-700"
        />

        {state.status !== 'running' && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 rounded-lg bg-black/40 text-center text-white">
            <p className="px-4 text-lg font-medium">{overlayMessage}</p>
            <button
              type="button"
              onClick={jump}
              className="rounded-lg bg-white px-5 py-2.5 font-semibold text-neutral-900 transition-colors hover:bg-neutral-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              {state.status === 'idle' ? 'Começar' : 'Jogar de novo'}
            </button>
          </div>
        )}
      </div>
    </Section>
  )
}
