/*
  Inicialização do tema antes do React (evita "flash" do tema errado).
  Script próprio (self-hosted) — compatível com a CSP (script-src 'self').
*/
;(function () {
  try {
    var stored = localStorage.getItem('theme')
    var prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    var theme = stored || (prefersDark ? 'dark' : 'light')
    if (theme === 'dark') {
      document.documentElement.classList.add('dark')
    }
  } catch (e) {
    /* localStorage indisponível — mantém o tema padrão (claro) */
  }
})()
