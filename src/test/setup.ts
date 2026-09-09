// Setup global de testes: adiciona os matchers do jest-dom (toBeInTheDocument, etc.),
// instala mocks de IntersectionObserver e matchMedia e limpa o DOM entre os testes.
import '@testing-library/jest-dom/vitest'
import { afterEach } from 'vitest'
import { cleanup } from '@testing-library/react'
import { MockIntersectionObserver, resetIntersection } from './intersection'

// jsdom não implementa o contexto 2D do canvas. Retornamos null silenciosamente
// (o hook do jogo já trata esse caso) para evitar avisos ruidosos nos testes.
HTMLCanvasElement.prototype.getContext = (() =>
  null) as typeof HTMLCanvasElement.prototype.getContext

// jsdom não implementa IntersectionObserver nem matchMedia.
globalThis.IntersectionObserver =
  MockIntersectionObserver as unknown as typeof IntersectionObserver

if (typeof window.matchMedia !== 'function') {
  window.matchMedia = ((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => false,
  })) as typeof window.matchMedia
}

afterEach(() => {
  cleanup()
  resetIntersection()
  document.documentElement.classList.remove('a11y-reduce-motion')
  document.documentElement.style.fontSize = ''
})
