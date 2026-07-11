/*
  Inicialização do tema antes do React (evita "flash" do tema errado).
  Script próprio (self-hosted) — compatível com a CSP (script-src 'self').
*/
;(function () {
  // Padrão: tema escuro (letras claras). Se o usuário já escolheu um tema
  // antes, essa preferência salva prevalece.
  var theme = 'dark'
  try {
    var stored = localStorage.getItem('theme')
    if (stored === 'light' || stored === 'dark') {
      theme = stored
    }
  } catch (e) {
    /* localStorage indisponível — mantém o tema padrão (escuro) */
  }
  if (theme === 'dark') {
    document.documentElement.classList.add('dark')
  }
})()
