import { useEffect, useRef, useState } from 'react'
import { useI18n } from '../i18n/context'
import { prefersReducedMotion } from '../lib/prefersReducedMotion'

interface TileCarouselProps {
  items: string[]
  /** Rótulo acessível do grupo (ex.: "Competências", "Certificações"). */
  ariaLabel: string
  /** Sentido do avanço automático. */
  reverse?: boolean
  /** px por passo do clique na seta. */
  step?: number
  /** px por "tick" (30ms) do avanço automático. */
  speed?: number
}

const TICK_MS = 30

/**
 * Faixa horizontal de tiles com rolagem lateral (setas + arraste/toque) e
 * avanço automático suave, que pausa quando o mouse ou o foco do teclado
 * está sobre a faixa. Sob "reduzir animações" (sistema ou widget de
 * acessibilidade), o avanço automático fica desligado e sobra só a
 * navegação manual pelas setas.
 */
export function TileCarousel({
  items,
  ariaLabel,
  reverse = false,
  step = 240,
  speed = 0.6,
}: TileCarouselProps) {
  const { s } = useI18n()
  const trackRef = useRef<HTMLUListElement>(null)
  const halfWidthRef = useRef(0)
  const [paused, setPaused] = useState(false)
  const [reduce] = useState(prefersReducedMotion)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(true)

  const updateArrows = () => {
    const track = trackRef.current
    if (!track) return
    setCanScrollLeft(track.scrollLeft > 1)
    setCanScrollRight(
      track.scrollLeft + track.clientWidth < track.scrollWidth - 1,
    )
  }

  useEffect(() => {
    const track = trackRef.current
    if (!track) return
    halfWidthRef.current = track.scrollWidth / 2
    if (reverse) track.scrollLeft = halfWidthRef.current
    updateArrows()
    track.addEventListener('scroll', updateArrows, { passive: true })
    window.addEventListener('resize', updateArrows)
    return () => {
      track.removeEventListener('scroll', updateArrows)
      window.removeEventListener('resize', updateArrows)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (reduce) return
    const id = window.setInterval(() => {
      const track = trackRef.current
      const half = halfWidthRef.current
      if (!track || paused || half <= 0) return
      if (reverse) {
        track.scrollLeft -= speed
        if (track.scrollLeft <= 0) track.scrollLeft += half
      } else {
        track.scrollLeft += speed
        if (track.scrollLeft >= half) track.scrollLeft -= half
      }
    }, TICK_MS)
    return () => window.clearInterval(id)
  }, [paused, reduce, reverse, speed])

  const scroll = (direction: -1 | 1) => {
    trackRef.current?.scrollBy({
      left: direction * step,
      behavior: reduce ? 'auto' : 'smooth',
    })
  }

  const arrowClass =
    'flex h-9 w-9 shrink-0 items-center justify-center self-center rounded-full border border-neutral-300 text-neutral-700 transition enabled:hover:bg-neutral-100 disabled:cursor-not-allowed disabled:opacity-30 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-900 dark:border-neutral-700 dark:text-neutral-300 dark:enabled:hover:bg-neutral-900'

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

      <ul
        ref={trackRef}
        className="scrollbar-hide flex flex-1 gap-3 overflow-x-auto scroll-smooth"
      >
        {items.map((item, index) => (
          <li key={`a-${item}-${index}`} className="tile w-36 shrink-0">
            {item}
          </li>
        ))}
        {!reduce &&
          items.map((item, index) => (
            <li
              key={`b-${item}-${index}`}
              aria-hidden="true"
              className="tile w-36 shrink-0"
            >
              {item}
            </li>
          ))}
      </ul>

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
