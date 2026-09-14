import { useEffect, useRef, useState } from 'react'
import { prefersReducedMotion } from '../lib/prefersReducedMotion'

interface CountUpOptions {
  durationMs?: number
  decimals?: number
}

/**
 * Anima um número de 0 até `target` quando `start` vira true.
 * Respeita reduced-motion (vai direto ao alvo). Volta a 0 se `start` for false.
 */
export function useCountUp(
  target: number,
  start: boolean,
  opts?: CountUpOptions,
): number {
  const { durationMs = 1200, decimals = 0 } = opts ?? {}
  const [tweened, setTweened] = useState(0)
  const frameRef = useRef(0)

  const skipAnimation = start && prefersReducedMotion()

  useEffect(() => {
    if (!start || skipAnimation) return
    const startTime = performance.now()
    const tick = () => {
      const progress = Math.min((performance.now() - startTime) / durationMs, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      const factor = 10 ** decimals
      setTweened(Math.round(target * eased * factor) / factor)
      if (progress < 1) {
        frameRef.current = requestAnimationFrame(tick)
      }
    }
    frameRef.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frameRef.current)
  }, [target, start, skipAnimation, durationMs, decimals])

  if (!start) return 0
  if (skipAnimation) return target
  return tweened
}
