import type { Lang } from '../i18n/strings'

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
  tags: string[]
  repoUrl?: string
  liveUrl?: string
}

export interface Profile {
  name: string
  role: string
  about: string[]
  location: string
  skills: SkillGroup[]
  contacts: Contact[]
  projects: Project[]
}

/** Valor por idioma. */
type Localized<T> = Record<Lang, T>

interface ProfileData {
  name: string
  role: Localized<string>
  about: Localized<string[]>
  location: Localized<string>
  skills: { label: Localized<string>; items: string[] }[]
  contacts: Contact[]
  projects: {
    name: Localized<string>
    description: Localized<string>
    tags: string[]
    repoUrl?: string
    liveUrl?: string
  }[]
}

const data: ProfileData = {
  name: 'Carlos Eduardo',
  role: {
    pt: 'Desenvolvedor Full Stack',
    en: 'Full Stack Developer',
  },
  location: {
    pt: 'Rio de Janeiro, Brasil',
    en: 'Rio de Janeiro, Brazil',
  },
  about: {
    pt: [
      'Desenvolvedor Full Stack com domínio em Node.js, React e Angular, além de Java, C#, Python e SQL. Pós-graduado em Information Technology (Estácio) e com inglês fluente, fruto de vivência internacional nos Estados Unidos.',
      'Trago uma base técnica sólida construída em mais de 5 anos atuando com suporte técnico, eletrônica e sistemas embarcados — experiência que desenvolveu em mim forte capacidade de diagnóstico, resolução de problemas e atenção aos detalhes, hoje aplicada ao desenvolvimento de software.',
    ],
    en: [
      'Full Stack Developer skilled in Node.js, React and Angular, plus Java, C#, Python and SQL. Postgraduate in Information Technology (Estácio) and fluent in English, from living in the United States.',
      'I bring a solid technical foundation built over more than 5 years in technical support, electronics and embedded systems — experience that gave me strong diagnostic ability, problem-solving and attention to detail, now applied to software development.',
    ],
  },
  skills: [
    {
      label: { pt: 'Front-end', en: 'Front-end' },
      items: ['React', 'Angular', 'JavaScript', 'TypeScript'],
    },
    {
      label: { pt: 'Back-end', en: 'Back-end' },
      items: ['Node.js', 'Java', 'C#', 'Python'],
    },
    {
      label: { pt: 'Dados', en: 'Data' },
      items: ['SQL', 'Power BI'],
    },
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
      name: {
        pt: 'Portfólio com mini-game',
        en: 'Portfolio with mini-game',
      },
      description: {
        pt: 'Este site, com um mini-game 2D integrado e recorde pessoal salvo no navegador.',
        en: 'This website, with an integrated 2D mini-game and a personal high score saved in the browser.',
      },
      tags: ['React', 'TypeScript', 'Canvas', 'Tailwind'],
      repoUrl: 'https://github.com/Streche/Streche.github.io',
      liveUrl: 'https://streche.github.io',
    },
  ],
}

/** Retorna o conteúdo do portfólio já resolvido para o idioma escolhido. */
export function getProfile(lang: Lang): Profile {
  return {
    name: data.name,
    role: data.role[lang],
    about: data.about[lang],
    location: data.location[lang],
    skills: data.skills.map((group) => ({
      label: group.label[lang],
      items: group.items,
    })),
    contacts: data.contacts,
    projects: data.projects.map((project) => ({
      name: project.name[lang],
      description: project.description[lang],
      tags: project.tags,
      repoUrl: project.repoUrl,
      liveUrl: project.liveUrl,
    })),
  }
}
