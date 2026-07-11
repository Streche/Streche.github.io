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
    skills: string
    projects: string
    contact: string
  }
  skipToContent: string
  primaryNav: string
  sections: {
    about: string
    skills: string
    projects: string
    game: string
    contact: string
  }
  hero: { viewProjects: string; contact: string }
  contact: { intro: string }
  projectsNav: { prev: string; next: string }
  project: { code: string; live: string }
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
}

export const strings: Record<Lang, Strings> = {
  pt: {
    nav: {
      game: 'Jogo',
      about: 'Sobre',
      skills: 'Competências',
      projects: 'Projetos',
      contact: 'Contato',
    },
    skipToContent: 'Pular para o conteúdo',
    primaryNav: 'Navegação principal',
    sections: {
      about: 'Sobre mim',
      skills: 'Competências',
      projects: 'Projetos',
      game: 'Mini-game',
      contact: 'Contato',
    },
    hero: { viewProjects: 'Ver projetos', contact: 'Contato' },
    contact: { intro: 'Vamos conversar? Encontre-me nestes canais:' },
    projectsNav: {
      prev: 'Ver projetos anteriores',
      next: 'Ver próximos projetos',
    },
    project: { code: 'Código', live: 'Ver ao vivo' },
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
  },
  en: {
    nav: {
      game: 'Game',
      about: 'About',
      skills: 'Skills',
      projects: 'Projects',
      contact: 'Contact',
    },
    skipToContent: 'Skip to content',
    primaryNav: 'Main navigation',
    sections: {
      about: 'About me',
      skills: 'Skills',
      projects: 'Projects',
      game: 'Mini-game',
      contact: 'Contact',
    },
    hero: { viewProjects: 'View projects', contact: 'Contact' },
    contact: { intro: "Let's talk? Find me on these channels:" },
    projectsNav: {
      prev: 'See previous projects',
      next: 'See next projects',
    },
    project: { code: 'Code', live: 'Live demo' },
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
  },
}
