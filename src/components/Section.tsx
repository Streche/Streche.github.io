import type { ReactNode } from 'react'

interface SectionProps {
  /** Usado como âncora de navegação e para o aria-labelledby. */
  id: string
  title: string
  children: ReactNode
}

/**
 * Wrapper semântico de seção: garante <section> com cabeçalho acessível
 * (aria-labelledby) e espaçamento consistente em todo o site.
 */
export function Section({ id, title, children }: SectionProps) {
  const headingId = `${id}-title`
  return (
    <section
      id={id}
      aria-labelledby={headingId}
      className="mx-auto w-full max-w-3xl scroll-mt-20 px-6 py-16"
    >
      <h2
        id={headingId}
        className="mb-6 text-2xl font-bold tracking-tight text-neutral-900 sm:text-3xl dark:text-neutral-100"
      >
        {title}
      </h2>
      {children}
    </section>
  )
}
