import { renderHook, act } from '@testing-library/react'
import { useInView } from './useInView'
import { fireIntersection } from '../test/intersection'

describe('useInView', () => {
  it('começa invisível e fica visível ao entrar na viewport', () => {
    const { result } = renderHook(() => useInView<HTMLDivElement>())
    const element = document.createElement('div')

    act(() => {
      result.current.ref(element)
    })
    expect(result.current.inView).toBe(false)

    act(() => {
      fireIntersection(true)
    })
    expect(result.current.inView).toBe(true)
  })

  it('permanece visível depois de sair da viewport (revela uma vez)', () => {
    const { result } = renderHook(() => useInView<HTMLDivElement>())
    const element = document.createElement('div')

    act(() => {
      result.current.ref(element)
    })
    act(() => {
      fireIntersection(true)
    })
    act(() => {
      fireIntersection(false)
    })
    expect(result.current.inView).toBe(true)
  })
})
