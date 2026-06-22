import { profile } from '../data/profile'
import { Section } from '../components/Section'
import { Tag } from '../components/Tag'
import { ExternalLink } from '../components/ExternalLink'

/** Seção de projetos. */
export function Projects() {
  return (
    <Section id="projetos" title="Projetos">
      <ul className="grid gap-6 sm:grid-cols-2">
        {profile.projects.map((project) => (
          <li
            key={project.name}
            className="flex flex-col rounded-xl border border-neutral-200 p-6 dark:border-neutral-800"
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
    </Section>
  )
}
