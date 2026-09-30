import { render, screen, fireEvent, act } from '@testing-library/react'
import { TileCarousel } from './TileCarousel'

const ROW1 = ['React', 'TypeScript', 'Angular']
const ROW2 = ['Node.js', 'SQL']

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
  it('renderiza cada item de cada linha (mais a cópia oculta do loop) e as duas setas', () => {
    stubLayout(2000, 300)
    render(<TileCarousel rows={[ROW1, ROW2]} ariaLabel="Competências" />)
    for (const item of [...ROW1, ...ROW2]) {
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
      <TileCarousel rows={[ROW1, ROW2]} ariaLabel="Competências" />,
    )
    expect(container.querySelectorAll('li[aria-hidden="true"]')).toHaveLength(
      ROW1.length + ROW2.length,
    )
  })

  it('sob "reduzir animações", mostra cada item uma única vez', () => {
    document.documentElement.classList.add('a11y-reduce-motion')
    stubLayout(2000, 300)
    render(<TileCarousel rows={[ROW1, ROW2]} ariaLabel="Competências" />)
    for (const item of [...ROW1, ...ROW2]) {
      expect(screen.getAllByText(item)).toHaveLength(1)
    }
  })

  it('nowrap deixa todas as caixas com a mesma altura (sem quebra de linha)', () => {
    stubLayout(2000, 300)
    const { container } = render(
      <TileCarousel rows={[ROW1, ROW2]} ariaLabel="Competências" nowrap />,
    )
    const tiles = container.querySelectorAll('li')
    for (const tile of tiles) {
      expect(tile).toHaveClass('h-16', 'whitespace-nowrap')
    }
  })

  it('clica na seta direita: rola as duas linhas juntas para frente', () => {
    stubLayout(2000, 300)
    const { container } = render(
      <TileCarousel rows={[ROW1, ROW2]} ariaLabel="Competências" step={240} />,
    )
    const tracks = container.querySelectorAll('ul')
    tracks.forEach((track) => {
      ;(track as HTMLUListElement).scrollBy = vi.fn()
    })

    fireEvent.click(
      screen.getByRole('button', { name: 'Rolar para a direita' }),
    )
    tracks.forEach((track) => {
      expect((track as HTMLUListElement).scrollBy).toHaveBeenCalledWith(
        expect.objectContaining({ left: 240 }),
      )
    })
  })

  it('clica na seta esquerda: rola as duas linhas juntas para trás', () => {
    stubLayout(2000, 300)
    const { container } = render(
      <TileCarousel rows={[ROW1, ROW2]} ariaLabel="Competências" step={240} />,
    )
    const tracks = container.querySelectorAll('ul')
    const first = tracks[0] as HTMLUListElement
    // Simula que a faixa já rolou, para a seta "esquerda" ficar habilitada
    // (o estado das setas é decidido pela primeira linha).
    first.scrollLeft = 500
    fireEvent.scroll(first)
    tracks.forEach((track) => {
      ;(track as HTMLUListElement).scrollBy = vi.fn()
    })

    fireEvent.click(
      screen.getByRole('button', { name: 'Rolar para a esquerda' }),
    )
    tracks.forEach((track) => {
      expect((track as HTMLUListElement).scrollBy).toHaveBeenCalledWith(
        expect.objectContaining({ left: -240 }),
      )
    })
  })

  it('avança sozinho (linhas em sentidos opostos) e pausa quando o mouse passa por cima', () => {
    vi.useFakeTimers()
    stubLayout(2000, 300)
    const { container } = render(
      <TileCarousel rows={[ROW1, ROW2]} ariaLabel="Competências" speed={10} />,
    )
    const tracks = container.querySelectorAll('ul')
    const [row1Track, row2Track] = [
      tracks[0] as HTMLUListElement,
      tracks[1] as HTMLUListElement,
    ]
    const group = screen.getByRole('group', { name: 'Competências' })

    act(() => {
      vi.advanceTimersByTime(90)
    })
    expect(row1Track.scrollLeft).toBeGreaterThan(0)
    // A segunda linha começa em "half" e decresce (sentido oposto).
    expect(row2Track.scrollLeft).toBeLessThan(1000)

    const row1Advanced = row1Track.scrollLeft
    fireEvent.mouseEnter(group)
    act(() => {
      vi.advanceTimersByTime(90)
    })
    expect(row1Track.scrollLeft).toBe(row1Advanced)

    fireEvent.mouseLeave(group)
    act(() => {
      vi.advanceTimersByTime(90)
    })
    expect(row1Track.scrollLeft).toBeGreaterThan(row1Advanced)

    vi.useRealTimers()
  })

  it('não avança sozinho sob "reduzir animações"', () => {
    vi.useFakeTimers()
    document.documentElement.classList.add('a11y-reduce-motion')
    stubLayout(2000, 300)
    const { container } = render(
      <TileCarousel rows={[ROW1, ROW2]} ariaLabel="Competências" speed={10} />,
    )
    const track = container.querySelector('ul') as HTMLUListElement

    act(() => {
      vi.advanceTimersByTime(300)
    })
    expect(track.scrollLeft).toBe(0)

    vi.useRealTimers()
  })
})
