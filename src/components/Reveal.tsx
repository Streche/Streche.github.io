import type { ReactNode } from 'react'
import { useInView } from '../hooks/useInView'

interface RevealProps {
  className?: string
  children: ReactNode
}

/** Envolve um bloco e o revela (fade + slide) quando entra na viewport. */
export function Reveal({ className, children }: RevealProps) {
  const { ref, inView } = useInView<HTMLDivElement>()
  const classes = ['reveal', inView ? 'is-visible' : '', className ?? '']
    .filter(Boolean)
    .join(' ')
  return (
    <div ref={ref} className={classes}>
      {children}
    </div>
  )
}
