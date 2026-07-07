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
      'Sou o Carlos Eduardo, desenvolvedor full stack e carioca de coração. Muito antes de programar, eu já era o tipo de pessoa que abria os aparelhos só para entender como funcionavam por dentro. Foi essa curiosidade que me levou da eletrônica ao desenvolvimento de software. Nasci e moro no Rio de Janeiro, mas também vivi nos Estados Unidos, de onde trouxe o inglês fluente e o gosto por conhecer o mundo.',
      'Minha base técnica vem de mais de 5 anos com suporte técnico, eletrônica e sistemas embarcados. Passei pela Samsung e pela MARCRIS Solutions, onde cheguei a supervisionar uma equipe de cinco técnicos e a responder por projetos críticos. Foi ali que aprendi a diagnosticar problemas com calma, cuidar dos detalhes e entregar no prazo, reduzindo em 15% o tempo de diagnóstico de falhas em um time e em 20% a manutenção preventiva em outro.',
      'Hoje aplico essa mesma cabeça de diagnóstico ao código, com o front-end como especialidade (HTML5, CSS3, TypeScript, React e Angular), apoiado por Node.js, Java, C#, Python e SQL no back-end. No dia a dia domino ferramentas como Figma, Tailwind, Vercel e o Chrome DevTools, e tenho pós-graduação em Information Technology pela Estácio. O que me desafia é o problema difícil, aquele que pede para entender o todo antes de escrever a primeira linha. E o que me motiva é transformar esse quebra-cabeça em soluções eficientes e confiáveis.',
    ],
    en: [
      "I'm Carlos Eduardo, a full stack developer and a carioca at heart. Long before I wrote code, I was the kind of person who opened up gadgets just to understand how they worked inside, and that curiosity is what took me from electronics to software development. I was born and live in Rio de Janeiro, but I've also lived in the United States, which gave me fluent English and a taste for seeing the world.",
      "My technical foundation comes from more than 5 years in technical support, electronics and embedded systems. I worked at Samsung and at MARCRIS Solutions, where I supervised a team of five technicians and was responsible for critical projects. That's where I learned to diagnose problems calmly, care about the details and deliver on time, cutting fault-diagnosis time by 15% on one team and preventive maintenance by 20% on another.",
      'Today I bring that same diagnostic mindset to code, with front-end as my specialty (HTML5, CSS3, TypeScript, React and Angular), backed by Node.js, Java, C#, Python and SQL on the server side. Day to day I work with tools like Figma, Tailwind, Vercel and Chrome DevTools, and I hold a postgraduate degree in Information Technology from Estácio. What challenges me is the hard problem, the one that asks you to understand the whole before writing the first line. And what motivates me is turning that puzzle into efficient, reliable solutions.',
    ],
  },
  skills: [
    {
      label: { pt: 'Front-end', en: 'Front-end' },
      items: ['HTML5', 'CSS3', 'TypeScript', 'JavaScript', 'React', 'Angular'],
    },
    {
      label: { pt: 'Back-end', en: 'Back-end' },
      items: ['Node.js', 'Java', 'C#', 'Python'],
    },
    {
      label: { pt: 'Dados', en: 'Data' },
      items: ['SQL', 'Power BI'],
    },
    {
      label: { pt: 'Ferramentas', en: 'Tools' },
      items: ['Figma', 'Tailwind', 'Vercel', 'Chrome DevTools'],
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
