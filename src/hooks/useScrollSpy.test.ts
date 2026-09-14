import { renderHook, act } from '@testing-library/react'
import { useScrollSpy } from './useScrollSpy'
import { fireIntersection } from '../test/intersection'

describe('useScrollSpy', () => {
  it('acompanha a seção ativa respeitando a ordem da lista de ids', () => {
    const first = document.createElement('section')
    first.id = 'first'
    const second = document.createElement('section')
    second.id = 'second'
    document.body.append(first, second)

    const { result } = renderHook(() => useScrollSpy(['first', 'second']))
    expect(result.current).toBe('')

    act(() => {
      fireIntersection([{ target: second, isIntersecting: true }])
    })
    expect(result.current).toBe('second')

    act(() => {
      fireIntersection([{ target: first, isIntersecting: true }])
    })
    expect(result.current).toBe('first')

    act(() => {
      fireIntersection([{ target: first, isIntersecting: false }])
    })
    expect(result.current).toBe('second')

    first.remove()
    second.remove()
  })
})
