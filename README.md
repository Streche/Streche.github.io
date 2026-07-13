# Portfólio de Carlos Eduardo

Portfólio pessoal de **Carlos Eduardo**, desenvolvedor full stack, com um
mini-game 2D integrado (estilo endless-runner) e recorde pessoal salvo no
navegador. Bilíngue (PT/EN), com tema claro/escuro, currículo integrado e um
painel de acessibilidade. Hospedado no GitHub Pages.

🔗 **Ao vivo:** https://streche.github.io

## Lighthouse

![Performance](https://img.shields.io/badge/Lighthouse%20Performance-99-brightgreen)
![Accessibility](https://img.shields.io/badge/Accessibility-100-brightgreen)
![Best Practices](https://img.shields.io/badge/Best%20Practices-100-brightgreen)
![SEO](https://img.shields.io/badge/SEO-100-brightgreen)

## 🧱 Stack

- **TypeScript** + **React 19**
- **Vite** (build e dev server)
- **Tailwind CSS** (estilo)
- **HTML5 Canvas** (mini-game 2D)
- **localStorage** (preferências e recorde pessoal)

## 🛡️ Qualidade e boas práticas

- **ESLint + Prettier** — código limpo e padronizado
- **Husky + lint-staged** — checagem automática antes de cada commit
- **commitlint** — mensagens no padrão [Conventional Commits](https://www.conventionalcommits.org/)
- **Vitest + Testing Library** — testes automatizados
- **GitHub Actions (CI)** — lint, typecheck, testes e build a cada push/PR
- **Dependabot** — atualizações de dependências e segurança
- **TypeScript em modo `strict`**

## 🗂️ Arquitetura

Organização em camadas, com o **jogo desacoplado do React** (lógica pura,
testável e independente de DOM):

```
src/
  components/   # UI reutilizável genérica
  sections/     # seções da página (Hero, Sobre, Experiência, Competências, Projetos, Pergunte, Contato)
  game/         # mini-game, sem dependência de React
    engine/     # game loop, render, input
    entities/   # player, obstáculos
    systems/    # colisão, pontuação
    types.ts    # tipos de domínio do jogo
  hooks/        # hooks React (ponte entre o jogo e a UI)
  data/         # modelo de conteúdo do portfólio (fonte única)
  test/         # setup de testes
```

## 🚀 Scripts

| Comando                 | Descrição                              |
| ----------------------- | -------------------------------------- |
| `npm run dev`           | Servidor de desenvolvimento            |
| `npm run build`         | Build de produção                      |
| `npm run preview`       | Pré-visualiza o build                  |
| `npm run lint`          | Roda o ESLint                          |
| `npm run lint:fix`      | Corrige problemas de lint              |
| `npm run format`        | Formata o código com Prettier          |
| `npm run typecheck`     | Verifica os tipos (TypeScript)         |
| `npm test`              | Roda os testes                         |
| `npm run test:coverage` | Roda os testes com relatório de cobertura |

## 💻 Como rodar localmente

```bash
# Requer Node 24 (ver .nvmrc)
npm install
npm run dev
```

## 🎨 Créditos

Sprites e cenário do mini-game: **Jumper Pack** por [Kenney](https://kenney.nl)
(licença CC0). Veja [CREDITS.md](./CREDITS.md).

## 📄 Licença

[MIT](./LICENSE) © 2026 Carlos Eduardo
