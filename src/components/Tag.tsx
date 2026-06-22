interface TagProps {
  children: string
}

/** Etiqueta visual para tecnologias/competências. */
export function Tag({ children }: TagProps) {
  return (
    <span className="inline-flex items-center rounded-full border border-neutral-200 bg-neutral-50 px-3 py-1 text-sm font-medium text-neutral-700 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-300">
      {children}
    </span>
  )
}
