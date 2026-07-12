import type { Lang } from '../i18n/strings'
import { getProfile, type Profile } from './profile'

/** Currículo completo, resolvido para o idioma. Reusa os dados do portfólio. */
export interface Cv {
  fullName: string
  role: string
  email: string
  location: string
  summary: string
  languages: string[]
  highlights: string[]
  experience: Profile['experience']
  education: Profile['education']
  skills: Profile['skills']
}

const fullName = 'Carlos Eduardo de Menezes Silva'
const email = 'carlos.eduardodms1@gmail.com'

const summary: Record<Lang, string> = {
  pt: 'Profissional de TI com base sólida em suporte técnico, eletrônica e desenvolvimento web, atuando em ambientes multiculturais e corporativos. Inglês fluente, com vivência internacional nos Estados Unidos. Sólido em programação (Java, C#, Python, Node.js, React e Angular) e análise de dados (Excel avançado e Power BI), entregando soluções que aumentam a eficiência e reduzem falhas em sistemas embarcados e dispositivos móveis.',
  en: 'IT professional with a solid foundation in technical support, electronics and web development, working in multicultural and corporate environments. Fluent in English, with international experience in the United States. Proficient in programming (Java, C#, Python, Node.js, React and Angular) and data analysis (Advanced Excel and Power BI), delivering solutions that increase efficiency and reduce failures in embedded systems and mobile devices.',
}

const languages: Record<Lang, string[]> = {
  pt: ['Português (nativo)', 'Inglês (fluente)', 'Espanhol (intermediário)'],
  en: ['Portuguese (native)', 'English (fluent)', 'Spanish (intermediate)'],
}

const highlights: Record<Lang, string[]> = {
  pt: ['Intercâmbio Work and Travel nos EUA (Camp Leaders, 2025)'],
  en: ['Work and Travel exchange in the USA (Camp Leaders, 2025)'],
}

/** Retorna o currículo já resolvido para o idioma escolhido. */
export function getCv(lang: Lang): Cv {
  const profile = getProfile(lang)
  return {
    fullName,
    role: profile.role,
    email,
    location: profile.location,
    summary: summary[lang],
    languages: languages[lang],
    highlights: highlights[lang],
    experience: profile.experience,
    education: profile.education,
    skills: profile.skills,
  }
}
