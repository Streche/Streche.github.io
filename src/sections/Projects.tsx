import { useState } from 'react'
import { useI18n } from '../i18n/context'
import { Section } from '../components/Section'
import { Tag } from '../components/Tag'
import { TileCarousel } from '../components/TileCarousel'
import { ExternalLink } from '../components/ExternalLink'
import type { Project } from '../data/profile'

/** Card de um projeto: número grande, descrição e "Ver estudo de caso" (quando houver). */
function ProjectCard({ project, index }: { project: Project; index: number }) {
  const { s } = useI18n()
  const [expanded, setExpanded] = useState(false)
  const cs = project.caseStudy
  const detailId = `caso-${project.name.replace(/\s+/g, '-')}`
  const ghostBtn =
    'inline-flex rounded-full border-2 border-neutral-300 px-4 py-1.5 text-xs font-medium tracking-widest text-neutral-700 uppercase transition-colors hover:bg-neutral-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-900 dark:border-neutral-600 dark:text-neutral-200 dark:hover:bg-neutral-800'

  return (
    <li className="rounded-[32px] border-2 border-neutral-200 p-6 sm:p-8 dark:border-neutral-700">
      <div className="flex flex-wrap items-baseline gap-x-4 gap-y-2">
        <span
          className="text-gradient font-black leading-none"
          style={{ fontSize: 'clamp(2rem, 6vw, 3.5rem)' }}
          aria-hidden="true"
        >
          {String(index + 1).padStart(2, '0')}
        </span>
        <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">
          {project.name}
        </h3>
      </div>

      <p className="mt-3 text-neutral-700 dark:text-neutral-300">
        {project.description}
      </p>

      <ul className="mt-4 flex flex-wrap gap-2">
        {project.tags.map((tag) => (
          <li key={tag}>
            <Tag>{tag}</Tag>
          </li>
        ))}
      </ul>

      {cs && expanded && (
        <dl
          id={detailId}
          className="mt-4 space-y-2 border-t border-neutral-200 pt-4 text-sm dark:border-neutral-800"
        >
          <div>
            <dt className="font-semibold text-neutral-900 dark:text-neutral-100">
              {s.caseStudy.problem}
            </dt>
            <dd className="text-neutral-700 dark:text-neutral-300">
              {cs.problem}
            </dd>
          </div>
          <div>
            <dt className="font-semibold text-neutral-900 dark:text-neutral-100">
              {s.caseStudy.solution}
            </dt>
            <dd className="text-neutral-700 dark:text-neutral-300">
              {cs.solution}
            </dd>
          </div>
          <div>
            <dt className="font-semibold text-neutral-900 dark:text-neutral-100">
              {s.caseStudy.results}
            </dt>
            <dd className="text-neutral-700 dark:text-neutral-300">
              {cs.results}
            </dd>
          </div>
        </dl>
      )}

      <div className="mt-5 flex flex-wrap items-center gap-3">
        {project.liveUrl && (
          <ExternalLink href={project.liveUrl} className={ghostBtn}>
            {s.project.live}
          </ExternalLink>
        )}
        {project.repoUrl && (
          <ExternalLink href={project.repoUrl} className={ghostBtn}>
            {s.project.code}
          </ExternalLink>
        )}
        {cs && (
          <button
            type="button"
            onClick={() => setExpanded((value) => !value)}
            aria-expanded={expanded}
            aria-controls={detailId}
            className={ghostBtn}
          >
            {expanded ? s.caseStudy.hide : s.caseStudy.show}
          </button>
        )}
      </div>
    </li>
  )
}

/** Seção de projetos (lista vertical) seguida da grade de certificações. */
export function Projects() {
  const { s, profile } = useI18n()

  return (
    <Section id="projetos" title={s.sections.projects}>
      <ul className="space-y-6">
        {profile.projects.map((project, index) => (
          <ProjectCard key={project.name} project={project} index={index} />
        ))}
      </ul>

      <h3 className="mt-12 mb-4 text-sm font-semibold tracking-wide text-neutral-500 uppercase dark:text-neutral-400">
        {s.projects.certifications}
      </h3>
      <div className="full-bleed px-4 sm:px-6">
        <TileCarousel
          rows={[profile.certifications.map((cert) => cert.label)]}
          ariaLabel={s.projects.certifications}
        />
      </div>
    </Section>
  )
}
