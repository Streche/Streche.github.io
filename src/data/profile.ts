import type { Lang } from '../i18n/strings'

/** Identifica o ícone de cada categoria de competência. */
export type SkillIcon = 'frontend' | 'backend' | 'data' | 'tools'

export interface SkillGroup {
  label: string
  icon: SkillIcon
  items: string[]
}

export type ContactType = 'linkedin' | 'github' | 'email'

export interface Contact {
  type: ContactType
  label: string
  href: string
}

export interface CaseStudy {
  problem: string
  solution: string
  results: string
}

export interface Project {
  name: string
  description: string
  tags: string[]
  repoUrl?: string
  liveUrl?: string
  caseStudy?: CaseStudy
}

export interface ExperienceItem {
  role: string
  org: string
  period: string
  bullets: string[]
}

export interface EducationItem {
  course: string
  org: string
  period: string
}

export interface Profile {
  name: string
  role: string
  about: string[]
  location: string
  skills: SkillGroup[]
  experience: ExperienceItem[]
  education: EducationItem[]
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
  skills: { label: Localized<string>; icon: SkillIcon; items: string[] }[]
  experience: {
    role: Localized<string>
    org: string
    period: Localized<string>
    bullets: Localized<string[]>
  }[]
  education: {
    course: Localized<string>
    org: string
    period: string
  }[]
  contacts: Contact[]
  projects: {
    name: Localized<string>
    description: Localized<string>
    tags: string[]
    repoUrl?: string
    liveUrl?: string
    caseStudy?: {
      problem: Localized<string>
      solution: Localized<string>
      results: Localized<string>
    }
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
      'Minha base técnica vem de mais de 5 anos com suporte técnico, eletrônica e sistemas embarcados. Passei pela Samsung e pela MARCRIS Solutions, onde fiquei responsável pelo controle e manutenção de aparelhos eletrônicos e por projetos críticos. Foi ali que aprendi a diagnosticar problemas com calma, cuidar dos detalhes e entregar no prazo, reduzindo em 15% o tempo de diagnóstico de falhas em uma empresa e em 20% a manutenção preventiva em outra.',
      'Hoje aplico essa mesma cabeça de diagnóstico ao código, com o front-end como especialidade (HTML5, CSS3, TypeScript, React e Angular), apoiado por Node.js, Java, C#, Python e SQL no back-end. No dia a dia domino ferramentas como Figma, Tailwind, Vercel e o Chrome DevTools, e tenho graduação em Sistemas de Informação pela Estácio. O que me desafia é o problema difícil, aquele que pede para entender o todo antes de escrever a primeira linha. E o que me motiva é transformar esse quebra-cabeça em soluções eficientes e confiáveis.',
    ],
    en: [
      "I'm Carlos Eduardo, a full stack developer and a carioca at heart. Long before I wrote code, I was the kind of person who opened up gadgets just to understand how they worked inside, and that curiosity is what took me from electronics to software development. I was born and live in Rio de Janeiro, but I've also lived in the United States, which gave me fluent English and a taste for seeing the world.",
      "My technical foundation comes from more than 5 years in technical support, electronics and embedded systems. I worked at Samsung and at MARCRIS Solutions, where I was responsible for the control and maintenance of electronic devices and for critical projects. That's where I learned to diagnose problems calmly, care about the details and deliver on time, cutting fault-diagnosis time by 15% at one company and preventive maintenance by 20% at another.",
      'Today I bring that same diagnostic mindset to code, with front-end as my specialty (HTML5, CSS3, TypeScript, React and Angular), backed by Node.js, Java, C#, Python and SQL on the server side. Day to day I work with tools like Figma, Tailwind, Vercel and Chrome DevTools, and I hold a degree in Information Systems from Estácio. What challenges me is the hard problem, the one that asks you to understand the whole before writing the first line. And what motivates me is turning that puzzle into efficient, reliable solutions.',
    ],
  },
  skills: [
    {
      label: { pt: 'Front-end', en: 'Front-end' },
      icon: 'frontend',
      items: [
        'React',
        'TypeScript',
        'JavaScript',
        'Angular',
        'Next.js',
        'Vue',
        'HTML5',
        'CSS3',
        'Stylus',
        'Lit',
      ],
    },
    {
      label: { pt: 'Back-end', en: 'Back-end' },
      icon: 'backend',
      items: [
        'Node.js',
        'Java',
        'Python',
        'C#',
        'PHP',
        'Ruby',
        'C',
        'C++',
        'Swift',
        'VB.NET',
      ],
    },
    {
      label: { pt: 'Dados', en: 'Data' },
      icon: 'data',
      items: [
        'SQL',
        'MySQL',
        'MongoDB',
        'Redis',
        'Firebase',
        'NoSQL',
        'Power BI',
        'MQL',
        'CQL',
      ],
    },
    {
      label: { pt: 'Ferramentas', en: 'Tools' },
      icon: 'tools',
      items: [
        'Git',
        'GitHub',
        'Docker',
        'Figma',
        'Playwright',
        'VS Code',
        'Tailwind',
        'Vercel',
        'Netlify',
        'Chrome DevTools',
        'Eclipse',
      ],
    },
  ],
  experience: [
    {
      role: { pt: 'Instrutor e Orientador', en: 'Instructor and Counselor' },
      org: 'YMCA',
      period: { pt: '2025 · EUA · Temporário', en: '2025 · USA · Temporary' },
      bullets: {
        pt: [
          'Suporte diário a mais de 50 participantes de várias nacionalidades, em ambiente multicultural.',
          'Responsável pela supervisão, bem-estar e integração dos participantes.',
        ],
        en: [
          'Daily support to over 50 participants of various nationalities, in a multicultural environment.',
          'Responsible for the supervision, well-being and integration of participants.',
        ],
      },
    },
    {
      role: {
        pt: 'Auxiliar Técnico em Eletrônica / Supervisor',
        en: 'Electronics Technician Assistant / Supervisor',
      },
      org: 'Marcris Serviços',
      period: { pt: '2022 – 2025', en: '2022 – 2025' },
      bullets: {
        pt: [
          'Microeletrônica e circuitos integrados para sistemas embarcados, computadores e celulares.',
          'Responsável pelo controle e manutenção de aparelhos eletrônicos.',
          'Reduziu em 15% o tempo de diagnóstico de falhas.',
        ],
        en: [
          'Microelectronics and integrated circuits for embedded systems, computers and mobile phones.',
          'Responsible for the control and maintenance of electronic devices.',
          'Reduced fault-diagnosis time by 15%.',
        ],
      },
    },
    {
      role: {
        pt: 'Auxiliar Administrativo e Técnico',
        en: 'Administrative and Technical Assistant',
      },
      org: 'Linkcell Celulares / Samsung',
      period: { pt: '2020 – 2022', en: '2020 – 2022' },
      bullets: {
        pt: [
          'Suporte técnico especializado em produtos Samsung: montagem, manutenção e testes de funcionalidade.',
          'Reduziu em 20% o tempo de manutenção preventiva em dispositivos móveis.',
        ],
        en: [
          'Specialized technical support for Samsung products: assembly, maintenance and functionality testing.',
          'Reduced preventive maintenance time on mobile devices by 20%.',
        ],
      },
    },
  ],
  education: [
    {
      course: {
        pt: 'Graduação em Sistemas de Informação',
        en: "Bachelor's in Information Systems",
      },
      org: 'Universidade Estácio de Sá',
      period: '2020 – 2025',
    },
    {
      course: {
        pt: 'Técnico em Desenvolvimento Web',
        en: 'Web Development Technician',
      },
      org: 'Senac RJ',
      period: '2018 – 2019',
    },
    {
      course: { pt: 'Ensino Médio', en: 'High School' },
      org: 'C.E. Duque Costa',
      period: '2018',
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
      caseStudy: {
        problem: {
          pt: 'Eu precisava me destacar para recrutadores com algo além de um currículo, provando habilidade técnica de verdade.',
          en: 'I needed to stand out to recruiters with more than a résumé, proving real technical skill.',
        },
        solution: {
          pt: 'Construí este site do zero em React, TypeScript e Tailwind: dois idiomas (PT/EN), tema claro/escuro, um mini-game 2D em canvas, testes automatizados e deploy contínuo.',
          en: 'I built this site from scratch in React, TypeScript and Tailwind: two languages (PT/EN), light/dark theme, a 2D canvas mini-game, automated tests and continuous deployment.',
        },
        results: {
          pt: 'Um portfólio rápido e acessível, com dezenas de testes, CI/CD no GitHub Pages e cabeçalhos de segurança (CSP).',
          en: 'A fast, accessible portfolio, with dozens of tests, CI/CD on GitHub Pages and security headers (CSP).',
        },
      },
    },
    {
      name: {
        pt: 'Sistema de Cadastro de Clientes',
        en: 'Client Management System',
      },
      description: {
        pt: 'Aplicação web CRUD para cadastrar e gerenciar clientes, com validação e paginação.',
        en: 'A CRUD web app to register and manage clients, with validation and pagination.',
      },
      tags: ['PHP', 'CakePHP', 'MySQL', 'MVC'],
      repoUrl: 'https://github.com/Streche/projeto',
      caseStudy: {
        problem: {
          pt: 'Eu precisava praticar desenvolvimento back-end com um framework MVC de verdade, indo além de scripts soltos.',
          en: 'I needed to practice back-end development with a real MVC framework, beyond loose scripts.',
        },
        solution: {
          pt: 'Construí um CRUD completo de clientes em CakePHP 3, com validação no servidor (e-mail único), paginação, mensagens de feedback e testes com PHPUnit.',
          en: 'I built a complete client CRUD in CakePHP 3, with server-side validation (unique email), pagination, feedback messages and PHPUnit tests.',
        },
        results: {
          pt: 'Uma aplicação organizada em camadas (MVC), com integração contínua (Travis CI), que consolidou minha base em PHP e bancos de dados.',
          en: 'A layered (MVC) application with continuous integration (Travis CI) that consolidated my foundation in PHP and databases.',
        },
      },
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
      icon: group.icon,
      items: group.items,
    })),
    experience: data.experience.map((item) => ({
      role: item.role[lang],
      org: item.org,
      period: item.period[lang],
      bullets: item.bullets[lang],
    })),
    education: data.education.map((item) => ({
      course: item.course[lang],
      org: item.org,
      period: item.period,
    })),
    contacts: data.contacts,
    projects: data.projects.map((project) => ({
      name: project.name[lang],
      description: project.description[lang],
      tags: project.tags,
      repoUrl: project.repoUrl,
      liveUrl: project.liveUrl,
      caseStudy: project.caseStudy && {
        problem: project.caseStudy.problem[lang],
        solution: project.caseStudy.solution[lang],
        results: project.caseStudy.results[lang],
      },
    })),
  }
}
