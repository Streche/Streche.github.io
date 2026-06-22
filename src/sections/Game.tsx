import { useRef } from 'react'
import { useI18n } from '../i18n/context'
import { Section } from '../components/Section'
import { useGame } from '../hooks/useGame'
import { GAME } from '../game/constants'

/** Seção do mini-game 2D (endless-runner) com recorde pessoal. */
export function Game() {
  const { s } = useI18n()
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const { state, jump } = useGame(canvasRef)

  const overlayMessage =
    state.status === 'idle' ? s.game.idle : s.game.gameover(state.score)

  return (
    <Section id="jogo" title={s.sections.game}>
      <p className="mb-4 text-neutral-700 dark:text-neutral-300">
        {s.game.instructions}
      </p>

      <div className="mb-3 flex justify-between font-mono text-sm text-neutral-700 dark:text-neutral-300">
        <span>
          {s.game.score}: {state.score}
        </span>
        <span>
          {s.game.best}: {state.highScore}
        </span>
      </div>

      <p className="sr-only" role="status">
        {state.status === 'running' ? s.game.running : overlayMessage}
      </p>

      <div className="relative">
        <canvas
          ref={canvasRef}
          width={GAME.width}
          height={GAME.height}
          onPointerDown={jump}
          role="img"
          aria-label={s.game.canvasLabel}
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
              {state.status === 'idle' ? s.game.start : s.game.restart}
            </button>
          </div>
        )}
      </div>
    </Section>
  )
}
