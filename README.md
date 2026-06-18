# Streche.github.io — Portfólio

Portfólio pessoal de **Carlos Eduardo** — Desenvolvedor Full Stack — com um
mini-game 2D integrado (estilo endless-runner) e recorde pessoal salvo no
navegador. Hospedado no GitHub Pages.

> 🚧 **Em construção.** Fundação do projeto concluída (Fases 0 e 1).

## 🧱 Stack

- **TypeScript** + **React 19**
- **Vite** (build e dev server)
- **Tailwind CSS** (estilo)
- **HTML5 Canvas** (mini-game 2D) — _a implementar_
- **localStorage** (recorde pessoal) — _a implementar_

## 🛡️ Qualidade e boas práticas

- **ESLint + Prettier** — código limpo e padronizado
- **Husky + lint-staged** — checagem automática antes de cada commit
- **commitlint** — mensagens no padrão [Conventional Commits](https://www.conventionalcommits.org/)
- **Vitest + Testing Library** — testes automatizados
- **GitHub Actions (CI)** — lint, typecheck, testes e build a cada push/PR
- **Dependabot** — atualizações de dependências e segurança
- **TypeScript em modo `strict`**

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

## 📄 Licença

[MIT](./LICENSE) © 2026 Carlos Eduardo
