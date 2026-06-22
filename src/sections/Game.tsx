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
      ? 'Toque ou clique para começar'
      : `Fim de jogo! Você fez ${state.score} ponto${state.score === 1 ? '' : 's'}.`

  return (
    <Section id="jogo" title="Mini-game">
      <p className="mb-4 text-neutral-700 dark:text-neutral-300">
        Toque (ou clique) para começar. Durante a partida, pule com espaço ou um
        toque na tela.
      </p>

      <div className="mb-3 flex justify-between font-mono text-sm text-neutral-700 dark:text-neutral-300">
        <span>Pontos: {state.score}</span>
        <span>Recorde: {state.highScore}</span>
      </div>

      {/*
        Região de status para leitores de tela: anuncia apenas as transições
        (início/fim de jogo), evitando narrar o score a cada frame.
      */}
      <p className="sr-only" role="status">
        {state.status === 'running' ? 'Jogo em andamento.' : overlayMessage}
      </p>

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
