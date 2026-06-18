/**
 * App raiz. Estrutura real (seções do portfólio + jogo) entra nas Fases 3 e 4.
 * Por enquanto, um placeholder mínimo que valida Tailwind e o build.
 */
function App() {
  return (
    <main className="flex min-h-svh flex-col items-center justify-center gap-4 bg-white p-8 text-center dark:bg-neutral-950">
      <h1 className="text-4xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100">
        Carlos Eduardo
      </h1>
      <p className="max-w-md text-neutral-600 dark:text-neutral-400">
        Portfólio em construção — Desenvolvedor Full Stack. 🚧
      </p>
    </main>
  )
}

export default App
