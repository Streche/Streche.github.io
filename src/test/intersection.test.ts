import { fireIntersection, resetIntersection } from './intersection'

describe('mock IntersectionObserver', () => {
  it('entrega os alvos observados para o callback via fireIntersection(true)', () => {
    const seen: boolean[] = []
    const observer = new IntersectionObserver((entries) => {
      for (const entry of entries) seen.push(entry.isIntersecting)
    })
    const el = document.createElement('div')
    observer.observe(el)

    fireIntersection(true)
    expect(seen).toEqual([true])

    observer.disconnect()
    fireIntersection(true)
    expect(seen).toEqual([true])

    resetIntersection()
  })
})
