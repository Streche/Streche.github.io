export const LANGS = ['pt', 'en'] as const
export type Lang = (typeof LANGS)[number]

/** Código usado no atributo lang do <html>. */
export const HTML_LANG: Record<Lang, string> = {
  pt: 'pt-BR',
  en: 'en-US',
}

export interface Strings {
  nav: {
    game: string
    about: string
    experience: string
    skills: string
    projects: string
    ask: string
    contact: string
  }
  skipToContent: string
  primaryNav: string
  sections: {
    about: string
    experience: string
    skills: string
    projects: string
    game: string
    ask: string
    contact: string
  }
  ask: { intro: string }
  experience: { work: string; education: string }
  hero: { viewProjects: string; contact: string }
  contact: { intro: string }
  projectsNav: { prev: string; next: string }
  project: { code: string; live: string }
  caseStudy: {
    show: string
    hide: string
    problem: string
    solution: string
    results: string
  }
  skills: { more: (count: number) => string; less: string }
  about: { more: string; less: string }
  game: {
    instructions: string
    score: string
    best: string
    start: string
    restart: string
    idle: string
    gameover: (score: number) => string
    canvasLabel: string
    running: string
  }
  controls: { theme: string; language: string }
  cv: string
  a11y: {
    title: string
    fontSize: string
    increase: string
    decrease: string
    contrast: string
    links: string
    spacing: string
    motion: string
    reset: string
  }
}

export const strings: Record<Lang, Strings> = {
  pt: {
    nav: {
      game: 'Jogo',
      about: 'Sobre',
      experience: 'Experiência',
      skills: 'Competências',
      projects: 'Projetos',
      ask: 'Pergunte',
      contact: 'Contato',
    },
    skipToContent: 'Pular para o conteúdo',
    primaryNav: 'Navegação principal',
    sections: {
      about: 'Sobre mim',
      experience: 'Experiência',
      skills: 'Competências',
      projects: 'Projetos',
      game: 'Mini-game',
      ask: 'Pergunte sobre mim',
      contact: 'Contato',
    },
    ask: { intro: 'Clique numa pergunta e eu respondo aqui.' },
    experience: {
      work: 'Experiência profissional',
      education: 'Formação acadêmica',
    },
    hero: { viewProjects: 'Ver projetos', contact: 'Contato' },
    contact: { intro: 'Vamos conversar? Encontre-me nestes canais:' },
    projectsNav: {
      prev: 'Ver projetos anteriores',
      next: 'Ver próximos projetos',
    },
    project: { code: 'Código', live: 'Ver ao vivo' },
    caseStudy: {
      show: 'Ver estudo de caso',
      hide: 'Ver menos',
      problem: 'Problema',
      solution: 'Solução',
      results: 'Resultado',
    },
    skills: { more: (count) => `Ver mais (${count})`, less: 'Ver menos' },
    about: { more: 'Ver mais', less: 'Ver menos' },
    game: {
      instructions:
        'Toque (ou clique) para começar. Durante a partida, pule com espaço ou um toque na tela.',
      score: 'Pontos',
      best: 'Recorde',
      start: 'Começar',
      restart: 'Jogar de novo',
      idle: 'Toque ou clique para começar',
      gameover: (score) =>
        `Fim de jogo! Você fez ${score} ponto${score === 1 ? '' : 's'}.`,
      canvasLabel: 'Mini-game: pule para desviar dos obstáculos',
      running: 'Jogo em andamento.',
    },
    controls: {
      theme: 'Alternar tema claro/escuro',
      language: 'Switch to English',
    },
    cv: 'Currículo',
    a11y: {
      title: 'Acessibilidade',
      fontSize: 'Tamanho da fonte',
      increase: 'Aumentar fonte',
      decrease: 'Diminuir fonte',
      contrast: 'Alto contraste',
      links: 'Destacar links',
      spacing: 'Mais espaçamento',
      motion: 'Reduzir animações',
      reset: 'Redefinir',
    },
  },
  en: {
    nav: {
      game: 'Game',
      about: 'About',
      experience: 'Experience',
      skills: 'Skills',
      projects: 'Projects',
      ask: 'Ask',
      contact: 'Contact',
    },
    skipToContent: 'Skip to content',
    primaryNav: 'Main navigation',
    sections: {
      about: 'About me',
      experience: 'Experience',
      skills: 'Skills',
      projects: 'Projects',
      game: 'Mini-game',
      ask: 'Ask me anything',
      contact: 'Contact',
    },
    ask: { intro: "Click a question and I'll answer here." },
    experience: {
      work: 'Professional experience',
      education: 'Education',
    },
    hero: { viewProjects: 'View projects', contact: 'Contact' },
    contact: { intro: "Let's talk? Find me on these channels:" },
    projectsNav: {
      prev: 'See previous projects',
      next: 'See next projects',
    },
    project: { code: 'Code', live: 'Live demo' },
    caseStudy: {
      show: 'View case study',
      hide: 'Show less',
      problem: 'Problem',
      solution: 'Solution',
      results: 'Results',
    },
    skills: { more: (count) => `See ${count} more`, less: 'See less' },
    about: { more: 'See more', less: 'See less' },
    game: {
      instructions:
        'Tap (or click) to start. During the match, jump with space or a tap on the screen.',
      score: 'Score',
      best: 'Best',
      start: 'Start',
      restart: 'Play again',
      idle: 'Tap or click to start',
      gameover: (score) =>
        `Game over! You scored ${score} point${score === 1 ? '' : 's'}.`,
      canvasLabel: 'Mini-game: jump to dodge the obstacles',
      running: 'Game in progress.',
    },
    controls: {
      theme: 'Toggle light/dark theme',
      language: 'Mudar para Português',
    },
    cv: 'Download CV',
    a11y: {
      title: 'Accessibility',
      fontSize: 'Font size',
      increase: 'Increase font',
      decrease: 'Decrease font',
      contrast: 'High contrast',
      links: 'Highlight links',
      spacing: 'More spacing',
      motion: 'Reduce motion',
      reset: 'Reset',
    },
  },
}
