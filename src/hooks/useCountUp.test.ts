import { renderHook, waitFor } from '@testing-library/react'
import { useCountUp } from './useCountUp'

describe('useCountUp', () => {
  it('fica em 0 enquanto start é false', () => {
    const { result } = renderHook(() => useCountUp(100, false))
    expect(result.current).toBe(0)
  })

  it('anima até o alvo quando start vira true', async () => {
    const { result } = renderHook(() =>
      useCountUp(50, true, { durationMs: 30 }),
    )
    await waitFor(() => expect(result.current).toBe(50), { timeout: 1000 })
  })

  it('vai direto ao alvo com prefers-reduced-motion (media query)', () => {
    const spy = vi.spyOn(window, 'matchMedia').mockReturnValue({
      matches: true,
      media: '(prefers-reduced-motion: reduce)',
      onchange: null,
      addListener: () => {},
      removeListener: () => {},
      addEventListener: () => {},
      removeEventListener: () => {},
      dispatchEvent: () => false,
    } as MediaQueryList)

    const { result } = renderHook(() => useCountUp(100, true))
    expect(result.current).toBe(100)
    spy.mockRestore()
  })

  it('vai direto ao alvo com a classe a11y-reduce-motion', () => {
    document.documentElement.classList.add('a11y-reduce-motion')
    const { result } = renderHook(() => useCountUp(100, true))
    expect(result.current).toBe(100)
  })
})
