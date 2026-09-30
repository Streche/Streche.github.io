import { useEffect, useRef, useState } from 'react'
import { useI18n } from '../i18n/context'
import { prefersReducedMotion } from '../lib/prefersReducedMotion'

interface TileCarouselProps {
  /** Uma linha de tiles por item do array (1 ou mais linhas empilhadas). */
  rows: string[][]
  /** Rótulo acessível do grupo (ex.: "Competências", "Certificações"). */
  ariaLabel: string
  /** px por passo do clique na seta (aplicado a todas as linhas juntas). */
  step?: number
  /** px por "tick" (30ms) do avanço automático de cada linha. */
  speed?: number
  /** Impede que o texto quebre linha, deixando todas as caixas do mesmo
   * tamanho (altura de uma linha só), como pediu o usuário. */
  nowrap?: boolean
}

const TICK_MS = 30

/**
 * Uma ou mais faixas horizontais de tiles, empilhadas, com UM par de setas
 * controlando todas juntas. Cada linha avança sozinha (linhas pares para a
 * direita, ímpares para a esquerda) e pausa quando o mouse ou o foco do
 * teclado está sobre o grupo. Sob "reduzir animações" (sistema ou widget
 * de acessibilidade), o avanço automático desliga e sobra só a navegação
 * manual pelas setas, sem duplicar conteúdo para leitor de tela.
 */
export function TileCarousel({
  rows,
  ariaLabel,
  step = 240,
  speed = 0.6,
  nowrap = false,
}: TileCarouselProps) {
  const { s } = useI18n()
  const tracksRef = useRef<(HTMLUListElement | null)[]>([])
  const halfWidthsRef = useRef<number[]>([])
  const [paused, setPaused] = useState(false)
  const [reduce] = useState(prefersReducedMotion)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(true)

  const updateArrows = () => {
    const track = tracksRef.current[0]
    if (!track) return
    setCanScrollLeft(track.scrollLeft > 1)
    setCanScrollRight(
      track.scrollLeft + track.clientWidth < track.scrollWidth - 1,
    )
  }

  useEffect(() => {
    const tracks = tracksRef.current
    halfWidthsRef.current = tracks.map((track, index) => {
      const half = (track?.scrollWidth ?? 0) / 2
      if (track && index % 2 === 1) track.scrollLeft = half
      return half
    })
    updateArrows()
    const reference = tracks[0]
    reference?.addEventListener('scroll', updateArrows, { passive: true })
    window.addEventListener('resize', updateArrows)
    return () => {
      reference?.removeEventListener('scroll', updateArrows)
      window.removeEventListener('resize', updateArrows)
    }
  }, [])

  useEffect(() => {
    if (reduce) return
    const id = window.setInterval(() => {
      if (paused) return
      tracksRef.current.forEach((track, index) => {
        const half = halfWidthsRef.current[index]
        if (!track || !half || half <= 0) return
        if (index % 2 === 1) {
          track.scrollLeft -= speed
          if (track.scrollLeft <= 0) track.scrollLeft += half
        } else {
          track.scrollLeft += speed
          if (track.scrollLeft >= half) track.scrollLeft -= half
        }
      })
    }, TICK_MS)
    return () => window.clearInterval(id)
  }, [paused, reduce, speed])

  const scroll = (direction: -1 | 1) => {
    for (const track of tracksRef.current) {
      track?.scrollBy({
        left: direction * step,
        behavior: reduce ? 'auto' : 'smooth',
      })
    }
  }

  const arrowClass =
    'flex h-9 w-9 shrink-0 items-center justify-center self-center rounded-full border border-neutral-300 text-neutral-700 transition enabled:hover:bg-neutral-100 disabled:cursor-not-allowed disabled:opacity-30 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-900 dark:border-neutral-700 dark:text-neutral-300 dark:enabled:hover:bg-neutral-900'
  const tileClass = `tile h-16 w-36 shrink-0${nowrap ? ' overflow-hidden text-ellipsis whitespace-nowrap' : ''}`

  return (
    <div
      role="group"
      aria-label={ariaLabel}
      className="flex items-stretch gap-2"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      <button
        type="button"
        onClick={() => scroll(-1)}
        disabled={!canScrollLeft}
        aria-label={s.carousel.prev}
        className={arrowClass}
      >
        <span aria-hidden="true">‹</span>
      </button>

      <div className="flex flex-1 flex-col gap-3">
        {rows.map((rowItems, rowIndex) => (
          <ul
            key={rowIndex}
            ref={(el) => {
              tracksRef.current[rowIndex] = el
            }}
            className="scrollbar-hide flex gap-3 overflow-x-auto scroll-smooth"
          >
            {rowItems.map((item, index) => (
              <li key={`a-${item}-${index}`} className={tileClass}>
                {item}
              </li>
            ))}
            {!reduce &&
              rowItems.map((item, index) => (
                <li
                  key={`b-${item}-${index}`}
                  aria-hidden="true"
                  className={tileClass}
                >
                  {item}
                </li>
              ))}
          </ul>
        ))}
      </div>

      <button
        type="button"
        onClick={() => scroll(1)}
        disabled={!canScrollRight}
        aria-label={s.carousel.next}
        className={arrowClass}
      >
        <span aria-hidden="true">›</span>
      </button>
    </div>
  )
}
