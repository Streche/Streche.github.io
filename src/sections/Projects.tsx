import { useRef } from 'react'
import { profile } from '../data/profile'
import { Section } from '../components/Section'
import { Tag } from '../components/Tag'
import { ExternalLink } from '../components/ExternalLink'

/** Seção de projetos com rolagem horizontal e setas (laterais). */
export function Projects() {
  const trackRef = useRef<HTMLUListElement>(null)

  const scroll = (direction: -1 | 1) => {
    const track = trackRef.current
    if (!track) return
    // Rola aproximadamente a largura de um card visível.
    const amount = Math.max(track.clientWidth * 0.8, 280)
    track.scrollBy({ left: direction * amount, behavior: 'smooth' })
  }

  const arrowClass =
    'flex h-10 w-10 shrink-0 items-center justify-center self-center rounded-full border border-neutral-300 text-neutral-700 transition-colors hover:bg-neutral-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-900 dark:border-neutral-700 dark:text-neutral-300 dark:hover:bg-neutral-900'

  return (
    <Section id="projetos" title="Projetos">
      <div className="flex items-stretch gap-2">
        <button
          type="button"
          onClick={() => scroll(-1)}
          aria-label="Ver projetos anteriores"
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
                    Código
                  </ExternalLink>
                )}
                {project.liveUrl && (
                  <ExternalLink
                    href={project.liveUrl}
                    className="text-neutral-900 underline underline-offset-4 hover:no-underline dark:text-neutral-100"
                  >
                    Ver ao vivo
                  </ExternalLink>
                )}
              </div>
            </li>
          ))}
        </ul>

        <button
          type="button"
          onClick={() => scroll(1)}
          aria-label="Ver próximos projetos"
          className={arrowClass}
        >
          <span aria-hidden="true">›</span>
        </button>
      </div>
    </Section>
  )
}
