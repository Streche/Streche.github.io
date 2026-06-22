// Setup global de testes: adiciona os matchers do jest-dom (toBeInTheDocument, etc.)
// e limpa o DOM entre os testes.
import '@testing-library/jest-dom/vitest'
import { afterEach } from 'vitest'
import { cleanup } from '@testing-library/react'

// jsdom não implementa o contexto 2D do canvas. Retornamos null silenciosamente
// (o hook do jogo já trata esse caso) para evitar avisos ruidosos nos testes.
HTMLCanvasElement.prototype.getContext = (() =>
  null) as typeof HTMLCanvasElement.prototype.getContext

afterEach(() => {
  cleanup()
})
