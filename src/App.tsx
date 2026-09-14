import { useI18n } from './i18n/context'
import { useScrollSpy } from './hooks/useScrollSpy'
import { HeaderControls } from './components/HeaderControls'
import { A11yWidget } from './components/A11yWidget'
import { Hero } from './sections/Hero'
import { Game } from './sections/Game'
import { About } from './sections/About'
import { Experience } from './sections/Experience'
import { Skills } from './sections/Skills'
import { WhatIDo } from './sections/WhatIDo'
import { Projects } from './sections/Projects'
import { Ask } from './sections/Ask'
import { Contact } from './sections/Contact'

const SECTION_IDS: readonly string[] = [
  'competencias',
  'sobre',
  'experiencia',
  'projetos',
  'pergunte',
  'contato',
  'jogo',
]

function App() {
  const { s, profile } = useI18n()

  const activeId = useScrollSpy(SECTION_IDS)

  const navLinks = [
    { href: '#competencias', label: s.nav.skills },
    { href: '#sobre', label: s.nav.about },
    { href: '#experiencia', label: s.nav.experience },
    { href: '#projetos', label: s.nav.projects },
    { href: '#pergunte', label: s.nav.ask },
    { href: '#contato', label: s.nav.contact },
    { href: '#jogo', label: s.nav.game },
  ]

  return (
    <div className="app-bg relative min-h-svh overflow-x-clip text-neutral-900 dark:text-neutral-100">
      {/* Skip link: acessibilidade para navegação por teclado. */}
      <a
        href="#conteudo"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-neutral-900 focus:px-4 focus:py-2 focus:text-white"
      >
        {s.skipToContent}
      </a>

      <header className="sticky top-0 z-40 border-b border-neutral-200 bg-white/80 backdrop-blur dark:border-neutral-800 dark:bg-neutral-950/80">
        <nav
          aria-label={s.primaryNav}
          className="mx-auto flex max-w-3xl items-center justify-between px-6 py-4"
        >
          <a href="#inicio" className="font-semibold">
            {profile.name}
          </a>
          <div className="flex items-center gap-4">
            <ul className="hidden gap-6 text-sm sm:flex">
              {navLinks.map((link) => {
                const isActive = activeId === link.href.slice(1)
                return (
                  <li key={link.href}>
                    <a
                      href={link.href}
                      aria-current={isActive ? 'true' : undefined}
                      className={`link-underline transition-colors ${
                        isActive
                          ? 'is-active text-neutral-900 dark:text-neutral-100'
                          : 'text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100'
                      }`}
                    >
                      {link.label}
                    </a>
                  </li>
                )
              })}
            </ul>
            <HeaderControls />
          </div>
        </nav>
      </header>

      <main id="conteudo">
        <Hero />
        <Skills />
        <About />
        <Experience />
        <WhatIDo />
        <Projects />
        <Ask />
        <Contact />
        <Game />
      </main>

      <footer className="relative border-t border-neutral-200 py-8 text-center text-sm text-neutral-500 dark:border-neutral-800 dark:text-neutral-400">
        © {new Date().getFullYear()} {profile.name}
      </footer>

      <A11yWidget />
    </div>
  )
}

export default App
