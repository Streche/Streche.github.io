import type { Lang } from '../i18n/strings'

/** Uma pergunta e resposta do "Pergunte sobre mim" (chat guiado, click-para-perguntar). */
export interface FaqItem {
  id: string
  question: string
  answer: string
}

const faq: {
  id: string
  question: Record<Lang, string>
  answer: Record<Lang, string>
}[] = [
  {
    id: 'intro',
    question: { pt: 'Quem é você?', en: 'Who are you?' },
    answer: {
      pt: 'Sou o Carlos Eduardo, desenvolvedor full stack e carioca. Vim da eletrônica e do suporte técnico para o desenvolvimento de software, e trago essa cabeça de diagnóstico para o código.',
      en: "I'm Carlos Eduardo, a full stack developer from Rio. I came from electronics and technical support into software development, and I bring that diagnostic mindset to code.",
    },
  },
  {
    id: 'skills',
    question: {
      pt: 'Quais suas principais competências?',
      en: 'What are your main skills?',
    },
    answer: {
      pt: 'No front-end trabalho com React, TypeScript, Angular, HTML5 e CSS3. No back-end, com Node.js, Java, C#, Python e SQL. Também uso Git, Docker, Figma e Chrome DevTools.',
      en: 'On the front-end I work with React, TypeScript, Angular, HTML5 and CSS3. On the back-end, Node.js, Java, C#, Python and SQL. I also use Git, Docker, Figma and Chrome DevTools.',
    },
  },
  {
    id: 'experience',
    question: { pt: 'Qual sua experiência?', en: "What's your experience?" },
    answer: {
      pt: 'Mais de 5 anos em eletrônica e suporte técnico (Marcris e Samsung), com resultados medidos, como reduzir em 15% e 20% os tempos de diagnóstico e de manutenção. Também tive uma experiência internacional na YMCA, nos Estados Unidos.',
      en: 'More than 5 years in electronics and technical support (Marcris and Samsung), with measured results, such as cutting diagnosis and maintenance times by 15% and 20%. I also had an international experience at the YMCA, in the United States.',
    },
  },
  {
    id: 'education',
    question: { pt: 'Qual sua formação?', en: "What's your education?" },
    answer: {
      pt: 'Tenho graduação em Sistemas de Informação (Estácio) e o Técnico em Desenvolvimento Web (Senac RJ).',
      en: 'I have a degree in Information Systems (Estácio) and a Web Development technical course (Senac RJ).',
    },
  },
  {
    id: 'availability',
    question: {
      pt: 'Está disponível para trabalho?',
      en: 'Are you available for work?',
    },
    answer: {
      pt: 'Sim! Estou aberto a vagas presenciais, híbridas ou remotas.',
      en: "Yes! I'm open to on-site, hybrid or remote roles.",
    },
  },
  {
    id: 'languages',
    question: { pt: 'Fala inglês?', en: 'Do you speak English?' },
    answer: {
      pt: 'Falo inglês fluente, com vivência nos Estados Unidos, e espanhol intermediário.',
      en: 'I speak fluent English, with lived experience in the United States, and intermediate Spanish.',
    },
  },
  {
    id: 'projects',
    question: {
      pt: 'Quais projetos você já fez?',
      en: 'What projects have you built?',
    },
    answer: {
      pt: 'Fiz este portfólio (React, com um mini-game em canvas) e um sistema de cadastro de clientes em CakePHP. Dá para ver os detalhes na seção Projetos.',
      en: 'I built this portfolio (React, with a canvas mini-game) and a client management system in CakePHP. You can see the details in the Projects section.',
    },
  },
  {
    id: 'cv',
    question: { pt: 'Posso ver seu currículo?', en: 'Can I see your résumé?' },
    answer: {
      pt: 'Claro! É só clicar no botão Currículo, aqui no topo ou na seção de contato.',
      en: 'Of course! Just click the CV button, at the top or in the contact section.',
    },
  },
  {
    id: 'contact',
    question: { pt: 'Como falo com você?', en: 'How can I reach you?' },
    answer: {
      pt: 'Me encontre no LinkedIn e no GitHub (links na seção Contato) ou baixe meu currículo.',
      en: 'Find me on LinkedIn and GitHub (links in the Contact section) or download my CV.',
    },
  },
  {
    id: 'why',
    question: { pt: 'Por que me contratar?', en: 'Why hire you?' },
    answer: {
      pt: 'Porque uno uma base técnica real, de anos resolvendo problemas de hardware e suporte, com o desenvolvimento full stack. Tenho foco no detalhe, aprendo rápido e gosto de entregar soluções que funcionam.',
      en: 'Because I combine a real technical foundation, from years solving hardware and support problems, with full stack development. I focus on detail, learn fast and like delivering solutions that work.',
    },
  },
]

/** Retorna o FAQ já resolvido para o idioma escolhido. */
export function getFaq(lang: Lang): FaqItem[] {
  return faq.map((item) => ({
    id: item.id,
    question: item.question[lang],
    answer: item.answer[lang],
  }))
}
