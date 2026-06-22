export interface Loop {
  start(): void
  stop(): void
}

/**
 * Game loop baseado em requestAnimationFrame, com delta time (dt) em segundos.
 * O dt é limitado a 50ms para evitar "saltos" quando a aba fica em background.
 */
export function createLoop(update: (dt: number) => void): Loop {
  let rafId = 0
  let last = 0
  let running = false

  function frame(now: number): void {
    if (!running) return
    const dt = Math.min((now - last) / 1000, 0.05)
    last = now
    update(dt)
    rafId = requestAnimationFrame(frame)
  }

  return {
    start() {
      if (running) return
      running = true
      last = performance.now()
      rafId = requestAnimationFrame(frame)
    },
    stop() {
      running = false
      cancelAnimationFrame(rafId)
    },
  }
}
