import { render, screen, fireEvent, act } from '@testing-library/react'
import { TileCarousel } from './TileCarousel'

const ITEMS = ['React', 'TypeScript', 'Angular']

/** jsdom não calcula layout: scrollWidth/clientWidth ficam sempre 0.
 * Forçamos valores plausíveis para exercitar a lógica de setas/loop. */
function stubLayout(scrollWidth: number, clientWidth: number) {
  Object.defineProperty(HTMLUListElement.prototype, 'scrollWidth', {
    configurable: true,
    get: () => scrollWidth,
  })
  Object.defineProperty(HTMLUListElement.prototype, 'clientWidth', {
    configurable: true,
    get: () => clientWidth,
  })
}

afterEach(() => {
  document.documentElement.classList.remove('a11y-reduce-motion')
})

describe('TileCarousel', () => {
  it('renderiza cada item (mais a cópia oculta do loop) e as duas setas', () => {
    stubLayout(2000, 300)
    render(<TileCarousel items={ITEMS} ariaLabel="Competências" />)
    for (const item of ITEMS) {
      expect(screen.getAllByText(item)).toHaveLength(2)
    }
    expect(
      screen.getByRole('button', { name: 'Rolar para a esquerda' }),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: 'Rolar para a direita' }),
    ).toBeInTheDocument()
  })

  it('a cópia duplicada (para o loop) fica aria-hidden', () => {
    stubLayout(2000, 300)
    const { container } = render(
      <TileCarousel items={ITEMS} ariaLabel="Competências" />,
    )
    expect(container.querySelectorAll('li[aria-hidden="true"]')).toHaveLength(
      ITEMS.length,
    )
  })

  it('sob "reduzir animações", mostra cada item uma única vez', () => {
    document.documentElement.classList.add('a11y-reduce-motion')
    stubLayout(2000, 300)
    render(<TileCarousel items={ITEMS} ariaLabel="Competências" />)
    for (const item of ITEMS) {
      expect(screen.getAllByText(item)).toHaveLength(1)
    }
  })

  it('clica na seta direita: rola a faixa para frente', () => {
    stubLayout(2000, 300)
    const { container } = render(
      <TileCarousel items={ITEMS} ariaLabel="Competências" step={240} />,
    )
    const track = container.querySelector('ul') as HTMLUListElement
    track.scrollBy = vi.fn()

    fireEvent.click(
      screen.getByRole('button', { name: 'Rolar para a direita' }),
    )
    expect(track.scrollBy).toHaveBeenCalledWith(
      expect.objectContaining({ left: 240 }),
    )
  })

  it('clica na seta esquerda: rola a faixa para trás', () => {
    stubLayout(2000, 300)
    const { container } = render(
      <TileCarousel items={ITEMS} ariaLabel="Competências" step={240} />,
    )
    const track = container.querySelector('ul') as HTMLUListElement
    // Simula que a faixa já rolou, para a seta "esquerda" ficar habilitada.
    track.scrollLeft = 500
    fireEvent.scroll(track)
    track.scrollBy = vi.fn()

    fireEvent.click(
      screen.getByRole('button', { name: 'Rolar para a esquerda' }),
    )
    expect(track.scrollBy).toHaveBeenCalledWith(
      expect.objectContaining({ left: -240 }),
    )
  })

  it('avança sozinho e pausa quando o mouse passa por cima', () => {
    vi.useFakeTimers()
    stubLayout(2000, 300)
    const { container } = render(
      <TileCarousel items={ITEMS} ariaLabel="Competências" speed={10} />,
    )
    const track = container.querySelector('ul') as HTMLUListElement
    const group = screen.getByRole('group', { name: 'Competências' })

    act(() => {
      vi.advanceTimersByTime(90)
    })
    const advanced = track.scrollLeft
    expect(advanced).toBeGreaterThan(0)

    fireEvent.mouseEnter(group)
    act(() => {
      vi.advanceTimersByTime(90)
    })
    expect(track.scrollLeft).toBe(advanced)

    fireEvent.mouseLeave(group)
    act(() => {
      vi.advanceTimersByTime(90)
    })
    expect(track.scrollLeft).toBeGreaterThan(advanced)

    vi.useRealTimers()
  })

  it('não avança sozinho sob "reduzir animações"', () => {
    vi.useFakeTimers()
    document.documentElement.classList.add('a11y-reduce-motion')
    stubLayout(2000, 300)
    const { container } = render(
      <TileCarousel items={ITEMS} ariaLabel="Competências" speed={10} />,
    )
    const track = container.querySelector('ul') as HTMLUListElement

    act(() => {
      vi.advanceTimersByTime(300)
    })
    expect(track.scrollLeft).toBe(0)

    vi.useRealTimers()
  })
})
