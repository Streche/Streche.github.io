import { intersects } from './collision'
import type { Rect } from '../types'

const rect = (x: number, y: number, width = 10, height = 10): Rect => ({
  x,
  y,
  width,
  height,
})

describe('intersects (AABB)', () => {
  it('detecta sobreposição', () => {
    expect(intersects(rect(0, 0), rect(5, 5))).toBe(true)
  })

  it('retorna false para retângulos separados', () => {
    expect(intersects(rect(0, 0), rect(20, 0))).toBe(false)
    expect(intersects(rect(0, 0), rect(0, 20))).toBe(false)
  })

  it('retorna false quando apenas as bordas se tocam', () => {
    // Encostar não é colidir (usa comparações estritas).
    expect(intersects(rect(0, 0), rect(10, 0))).toBe(false)
  })

  it('detecta um retângulo contido no outro', () => {
    expect(intersects(rect(0, 0, 100, 100), rect(10, 10, 5, 5))).toBe(true)
  })
})
