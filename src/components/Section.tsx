import type { ReactNode } from 'react'
import { Reveal } from './Reveal'

interface SectionProps {
  /** Usado como âncora de navegação e para o aria-labelledby. */
  id: string
  title: string
  children: ReactNode
  /**
   * Quando true, a seção ocupa a largura inteira da tela (sem o wrapper
   * centralizado max-w-3xl). Usado pelo mini-game, que fica de ponta a
   * ponta do site. O título e o conteúdo internos continuam com seu
   * próprio espaçamento.
   */
  fullBleed?: boolean
}

/**
 * Wrapper semântico de seção: garante <section> com cabeçalho acessível
 * (aria-labelledby) e espaçamento consistente em todo o site. O conteúdo é
 * revelado (fade + slide) ao entrar na viewport; o título fica estático.
 */
export function Section({ id, title, children, fullBleed }: SectionProps) {
  const headingId = `${id}-title`
  return (
    <section
      id={id}
      aria-labelledby={headingId}
      className={
        fullBleed
          ? 'scroll-mt-20 py-16'
          : 'mx-auto w-full max-w-3xl scroll-mt-20 px-6 py-16'
      }
    >
      <h2
        id={headingId}
        className={`text-gradient mb-6 font-black tracking-tight uppercase ${
          fullBleed ? 'px-6 text-center' : ''
        }`}
        style={{ fontSize: 'clamp(2rem, 7vw, 4.5rem)', lineHeight: 1 }}
      >
        {title}
      </h2>
      <Reveal>{children}</Reveal>
    </section>
  )
}
