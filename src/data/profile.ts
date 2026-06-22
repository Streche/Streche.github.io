/**
 * Modelo de conteúdo do portfólio (fonte única de dados).
 * Mantém o conteúdo separado da UI — as seções (Fase 3) apenas consomem isto.
 * Valores são provisórios e serão confirmados/ajustados na Fase 3.
 */

export interface SkillGroup {
  label: string
  items: string[]
}

export type ContactType = 'linkedin' | 'github' | 'email'

export interface Contact {
  type: ContactType
  label: string
  href: string
}

export interface Project {
  name: string
  description: string
  /** Tecnologias usadas, para exibir como tags. */
  tags: string[]
  /** Link do código (opcional). */
  repoUrl?: string
  /** Link da demo ao vivo (opcional). */
  liveUrl?: string
}

export interface Profile {
  name: string
  role: string
  about: string
  location: string
  skills: SkillGroup[]
  contacts: Contact[]
  projects: Project[]
}

/** TODO(Fase 3): substituir pelos textos finais confirmados pelo Carlos. */
export const profile: Profile = {
  name: 'Carlos Eduardo',
  role: 'Desenvolvedor Full Stack',
  about:
    'Desenvolvedor Full Stack com base sólida em suporte técnico e eletrônica, ' +
    'hoje focado em construir aplicações web. (Texto provisório — ajustar na Fase 3.)',
  location: 'Rio de Janeiro, Brasil',
  skills: [
    {
      label: 'Front-end',
      items: ['React', 'Angular', 'JavaScript', 'TypeScript'],
    },
    { label: 'Back-end', items: ['Node.js', 'Java', 'C#', 'Python'] },
    { label: 'Dados', items: ['SQL', 'Excel avançado', 'Power BI'] },
  ],
  contacts: [
    {
      type: 'linkedin',
      label: 'LinkedIn',
      href: 'https://www.linkedin.com/in/carlos-eduardo-695414195/',
    },
    { type: 'github', label: 'GitHub', href: 'https://github.com/Streche' },
    // TODO(Fase 3): confirmar se o e-mail deve aparecer publicamente.
  ],
  projects: [
    {
      name: 'Portfólio com mini-game',
      description:
        'Este site, com um mini-game 2D integrado e recorde pessoal salvo no navegador.',
      tags: ['React', 'TypeScript', 'Canvas', 'Tailwind'],
      repoUrl: 'https://github.com/Streche/Streche.github.io',
      liveUrl: 'https://streche.github.io',
    },
  ],
}
