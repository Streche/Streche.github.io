import type { Rect } from '../types'

/**
 * Detecção de colisão AABB (axis-aligned bounding box).
 * Retorna true se os dois retângulos se sobrepõem.
 */
export function intersects(a: Rect, b: Rect): boolean {
  return (
    a.x < b.x + b.width &&
    a.x + a.width > b.x &&
    a.y < b.y + b.height &&
    a.y + a.height > b.y
  )
}
