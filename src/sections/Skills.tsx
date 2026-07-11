import { useState } from 'react'
import type { ReactNode } from 'react'
import { useI18n } from '../i18n/context'
import { Section } from '../components/Section'
import { Tag } from '../components/Tag'
import type { SkillGroup, SkillIcon } from '../data/profile'

/** Quantidade de competências exibidas por grupo antes de "Ver mais". */
export const MAX_VISIBLE_SKILLS = 5

const iconProps = {
  width: 20,
  height: 20,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 2,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
  'aria-hidden': true,
}

/** Ícone (SVG inline) de cada categoria de competência. */
const groupIcons: Record<SkillIcon, ReactNode> = {
  frontend: (
    <svg {...iconProps}>
      <polyline points="16 18 22 12 16 6" />
      <polyline points="8 6 2 12 8 18" />
    </svg>
  ),
  backend: (
    <svg {...iconProps}>
      <rect x="2" y="3" width="20" height="6" rx="2" />
      <rect x="2" y="15" width="20" height="6" rx="2" />
      <line x1="6" y1="6" x2="6.01" y2="6" />
      <line x1="6" y1="18" x2="6.01" y2="18" />
    </svg>
  ),
  data: (
    <svg {...iconProps}>
      <ellipse cx="12" cy="5" rx="9" ry="3" />
      <path d="M3 5v14a9 3 0 0 0 18 0V5" />
      <path d="M3 12a9 3 0 0 0 18 0" />
    </svg>
  ),
  tools: (
    <svg {...iconProps}>
      <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
    </svg>
  ),
}

/** Card de uma categoria: ícone, título, 5 principais e "Ver mais" para o resto. */
function SkillCard({ group }: { group: SkillGroup }) {
  const { s } = useI18n()
  const [expanded, setExpanded] = useState(false)
  const hiddenCount = group.items.length - MAX_VISIBLE_SKILLS
  const hasMore = hiddenCount > 0
  const visibleItems = expanded
    ? group.items
    : group.items.slice(0, MAX_VISIBLE_SKILLS)
  const listId = `skills-${group.icon}`

  return (
    <div className="rounded-xl border border-neutral-200 p-6 dark:border-neutral-800">
      <div className="flex items-center gap-3">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-neutral-200 text-neutral-700 dark:border-neutral-800 dark:text-neutral-300">
          {groupIcons[group.icon]}
        </span>
        <h3 className="text-sm font-semibold tracking-wide text-neutral-500 uppercase dark:text-neutral-400">
          {group.label}
        </h3>
      </div>

      <ul id={listId} className="mt-4 flex flex-wrap gap-2">
        {visibleItems.map((item) => (
          <li key={item}>
            <Tag>{item}</Tag>
          </li>
        ))}
      </ul>

      {hasMore && (
        <button
          type="button"
          onClick={() => setExpanded((value) => !value)}
          aria-expanded={expanded}
          aria-controls={listId}
          className="mt-4 text-sm font-medium text-neutral-900 underline underline-offset-4 transition hover:no-underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-900 dark:text-neutral-100"
        >
          {expanded ? s.skills.less : s.skills.more(hiddenCount)}
        </button>
      )}
    </div>
  )
}

/** Seção de competências: cada categoria em um card com as principais e "Ver mais". */
export function Skills() {
  const { s, profile } = useI18n()
  return (
    <Section id="competencias" title={s.sections.skills}>
      <div className="grid gap-6 sm:grid-cols-2">
        {profile.skills.map((group) => (
          <SkillCard key={group.label} group={group} />
        ))}
      </div>
    </Section>
  )
}
