import { useCallback, useEffect, useRef, useState } from 'react'
import { useI18n } from '../i18n/context'
import { Section } from '../components/Section'
import { Tag } from '../components/Tag'
import { ExternalLink } from '../components/ExternalLink'

/** Seção de projetos com rolagem horizontal e setas (laterais). */
export function Projects() {
  const { s, profile } = useI18n()
  const trackRef = useRef<HTMLUListElement>(null)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(false)

  const updateArrows = useCallback(() => {
    const track = trackRef.current
    if (!track) return
    const { scrollLeft, scrollWidth, clientWidth } = track
    setCanScrollLeft(scrollLeft > 1)
    setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 1)
  }, [])

  useEffect(() => {
    updateArrows()
    const track = trackRef.current
    if (!track) return
    track.addEventListener('scroll', updateArrows, { passive: true })
    window.addEventListener('resize', updateArrows)
    return () => {
      track.removeEventListener('scroll', updateArrows)
      window.removeEventListener('resize', updateArrows)
    }
  }, [updateArrows])

  const scroll = (direction: -1 | 1) => {
    const track = trackRef.current
    if (!track) return
    const amount = Math.max(track.clientWidth * 0.8, 280)
    track.scrollBy({ left: direction * amount, behavior: 'smooth' })
  }

  const arrowClass =
    'flex h-10 w-10 shrink-0 items-center justify-center self-center rounded-full border border-neutral-300 text-neutral-700 transition enabled:hover:bg-neutral-100 disabled:cursor-not-allowed disabled:opacity-30 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-900 dark:border-neutral-700 dark:text-neutral-300 dark:enabled:hover:bg-neutral-900'

  return (
    <Section id="projetos" title={s.sections.projects}>
      <div className="flex items-stretch gap-2">
        <button
          type="button"
          onClick={() => scroll(-1)}
          disabled={!canScrollLeft}
          aria-label={s.projectsNav.prev}
          className={arrowClass}
        >
          <span aria-hidden="true">‹</span>
        </button>

        <ul
          ref={trackRef}
          className="flex flex-1 snap-x snap-mandatory gap-6 overflow-x-auto scroll-smooth pb-2"
        >
          {profile.projects.map((project) => (
            <li
              key={project.name}
              className="flex w-72 shrink-0 snap-start flex-col rounded-xl border border-neutral-200 p-6 sm:w-80 dark:border-neutral-800"
            >
              <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">
                {project.name}
              </h3>
              <p className="mt-2 flex-1 text-neutral-700 dark:text-neutral-300">
                {project.description}
              </p>
              <ul className="mt-4 flex flex-wrap gap-2">
                {project.tags.map((tag) => (
                  <li key={tag}>
                    <Tag>{tag}</Tag>
                  </li>
                ))}
              </ul>
              <div className="mt-4 flex gap-4 text-sm font-medium">
                {project.repoUrl && (
                  <ExternalLink
                    href={project.repoUrl}
                    className="text-neutral-900 underline underline-offset-4 hover:no-underline dark:text-neutral-100"
                  >
                    {s.project.code}
                  </ExternalLink>
                )}
                {project.liveUrl && (
                  <ExternalLink
                    href={project.liveUrl}
                    className="text-neutral-900 underline underline-offset-4 hover:no-underline dark:text-neutral-100"
                  >
                    {s.project.live}
                  </ExternalLink>
                )}
              </div>
            </li>
          ))}
        </ul>

        <button
          type="button"
          onClick={() => scroll(1)}
          disabled={!canScrollRight}
          aria-label={s.projectsNav.next}
          className={arrowClass}
        >
          <span aria-hidden="true">›</span>
        </button>
      </div>
    </Section>
  )
}
