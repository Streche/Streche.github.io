import { useI18n } from './i18n/context'
import { HeaderControls } from './components/HeaderControls'
import { Hero } from './sections/Hero'
import { Game } from './sections/Game'
import { About } from './sections/About'
import { Experience } from './sections/Experience'
import { Skills } from './sections/Skills'
import { Projects } from './sections/Projects'
import { Ask } from './sections/Ask'
import { Contact } from './sections/Contact'

function App() {
  const { s, profile } = useI18n()

  const navLinks = [
    { href: '#jogo', label: s.nav.game },
    { href: '#sobre', label: s.nav.about },
    { href: '#experiencia', label: s.nav.experience },
    { href: '#competencias', label: s.nav.skills },
    { href: '#projetos', label: s.nav.projects },
    { href: '#pergunte', label: s.nav.ask },
    { href: '#contato', label: s.nav.contact },
  ]

  return (
    <div className="min-h-svh bg-white text-neutral-900 dark:bg-neutral-950 dark:text-neutral-100">
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
              {navLinks.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="text-neutral-600 transition-colors hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
            <HeaderControls />
          </div>
        </nav>
      </header>

      <main id="conteudo">
        <Hero />
        <Game />
        <About />
        <Experience />
        <Skills />
        <Projects />
        <Ask />
        <Contact />
      </main>

      <footer className="border-t border-neutral-200 py-8 text-center text-sm text-neutral-500 dark:border-neutral-800 dark:text-neutral-400">
        © {new Date().getFullYear()} {profile.name}
      </footer>
    </div>
  )
}

export default App
