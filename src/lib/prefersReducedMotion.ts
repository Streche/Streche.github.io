/**
 * True quando o usuário pediu menos movimento: pela media query do sistema
 * ou pela classe do widget de acessibilidade (`a11y-reduce-motion` no <html>).
 */
export function prefersReducedMotion(): boolean {
  if (typeof document !== 'undefined') {
    if (document.documentElement.classList.contains('a11y-reduce-motion')) {
      return true
    }
  }
  if (
    typeof window !== 'undefined' &&
    typeof window.matchMedia === 'function'
  ) {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches
  }
  return false
}
