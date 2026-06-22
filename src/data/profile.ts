/**
 * Modelo de conteúdo do portfólio (fonte única de dados).
 * Mantém o conteúdo separado da UI — as seções apenas consomem isto.
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
  /** Link da demo ao vivo (opcional). Adicionado após o deploy (Fase 6). */
  liveUrl?: string
}

export interface Profile {
  name: string
  role: string
  /** Texto "sobre mim" em parágrafos. */
  about: string[]
  location: string
  skills: SkillGroup[]
  contacts: Contact[]
  projects: Project[]
}

export const profile: Profile = {
  name: 'Carlos Eduardo',
  role: 'Desenvolvedor Full Stack',
  about: [
    'Desenvolvedor Full Stack com domínio em Node.js, React e Angular, além de Java, C#, Python e SQL. Pós-graduado em Information Technology (Estácio) e com inglês fluente, fruto de vivência internacional nos Estados Unidos.',
    'Trago uma base técnica sólida construída em mais de 5 anos atuando com suporte técnico, eletrônica e sistemas embarcados — experiência que desenvolveu em mim forte capacidade de diagnóstico, resolução de problemas e atenção aos detalhes, hoje aplicada ao desenvolvimento de software.',
  ],
  location: 'Rio de Janeiro, Brasil',
  skills: [
    {
      label: 'Front-end',
      items: ['React', 'Angular', 'JavaScript', 'TypeScript'],
    },
    { label: 'Back-end', items: ['Node.js', 'Java', 'C#', 'Python'] },
    { label: 'Dados', items: ['SQL', 'Power BI'] },
  ],
  contacts: [
    {
      type: 'linkedin',
      label: 'LinkedIn',
      href: 'https://www.linkedin.com/in/carlos-eduardo-695414195/',
    },
    { type: 'github', label: 'GitHub', href: 'https://github.com/Streche' },
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
