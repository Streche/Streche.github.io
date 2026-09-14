# Design — v1.10.0 "Movimento e navegação"

Data: 2026-09-09
Status: **decisões fechadas** (todas as pendências resolvidas na 2ª sessão de 2026-09-09).
Próximo passo: revisão do spec pelo usuário, depois skill `writing-plans`.

## 1. Contexto e objetivo

Portfólio React 19 + Vite 8 + TypeScript + Tailwind v4 (CSS-first, sem config), i18n
PT/EN, tema claro/escuro por classe `.dark`, deploy GitHub Pages com CSP estrita
(`script-src 'self'`), Lighthouse ~99/100/100/100, v1.9.1.

Objetivo (itens 4 e 5 da lista de dicas para recrutador): deixar o front-end mais
atrativo com **movimento sóbrio** e **navegação melhor**, sem perder performance nem
acessibilidade.

Decisões já tomadas com o usuário (2026-09-09):
- **Sem biblioteca de animação.** Tudo CSS + hooks próprios. Zero kb extra, mantém
  Lighthouse 100, combina com o estilo do projeto (widget a11y próprio, motor do jogo
  próprio).
- **Contadores: sim, com faixa de números curada** dentro da seção "Sobre" (sem novo
  link de nav).
- **Hero com hierarquia de botões clara** (1 primário, 2 secundários, LinkedIn/GitHub
  viram ícones).

Restrições herdadas do projeto:
- `@media (prefers-reduced-motion: reduce)` e a classe `.a11y-reduce-motion` (widget de
  acessibilidade) já forçam `transition-duration`/`animation-duration` para ~0. Toda
  animação feita por transição/keyframe CSS já é neutralizada de graça. JS de contagem
  precisa checar reduced-motion explicitamente.
- Nav fixa já existe em `src/App.tsx` (`<header className="sticky top-0 z-40 ...">`),
  com 7 links de seção, `hidden ... sm:flex` (desktop apenas). Não é "criar nav", é
  adicionar scroll-spy nela.
- `src/i18n/strings.ts` tem interface `Strings` tipada: todo texto novo entra na
  interface + nas duas traduções.
- `src/test/setup.ts` NÃO tem mock de `IntersectionObserver` nem de `matchMedia`.
  Precisa adicionar.
- Ícones no projeto são SVG inline com `iconProps` compartilhado (ver
  `src/components/HeaderControls.tsx`).

## 2. Primitivos novos (compartilhados)

### 2.1 `src/hooks/useInView.ts`
`useInView<T extends Element = HTMLElement>(): { ref: (node: T | null) => void; inView: boolean }`.
- Sem argumentos; defaults fixos: `threshold: 0.15`, `rootMargin: '0px 0px -10% 0px'`
  (dispara pouco antes de entrar 100%). Um ref-callback estável evita re-observar a
  cada render.
- Revela uma vez: quando `inView` vira `true`, desconecta o observer e trava.
- Guarda: se `typeof IntersectionObserver === 'undefined'`, `inView = true` na hora
  (progressive enhancement, conteúdo nunca fica invisível).
- Limpa o observer no unmount.
- Teste: mock de IO em setup; simular entrada; garantir que trava em `true`.

### 2.2 `src/hooks/useCountUp.ts`
`useCountUp(target: number, start: boolean, opts?: { durationMs?: number; decimals?: number }): number`.
- Quando `start` vira `true`, anima de 0 a `target` com `requestAnimationFrame` +
  easeOutCubic. `durationMs` padrão 1200, `decimals` padrão 0.
- Reduced-motion: se
  `window.matchMedia('(prefers-reduced-motion: reduce)').matches` **ou**
  `document.documentElement.classList.contains('a11y-reduce-motion')`, retorna `target`
  imediatamente, sem animar.
- Limpa o rAF no unmount; se `start` continуar `false`, retorna 0 (ou `target` se
  reduced-motion).
- Teste: mock de rAF/tempo; chega no `target`; short-circuit de reduced-motion
  (ambos os caminhos: media query e classe).

### 2.3 `src/hooks/useScrollSpy.ts`
`useScrollSpy(ids: string[]): string` — retorna o id da seção "ativa".
- IntersectionObserver observando cada `#id`; `rootMargin` tipo
  `-45% 0px -50% 0px` para considerar ativa a seção que está no terço superior da
  viewport. Mantém o último id ativo quando nenhuma bate (ex.: topo da página).
- Teste: mock de IO; alternar entradas; conferir que o id ativo acompanha.

### 2.4 `src/components/Reveal.tsx`
`<Reveal className?: string; children>`.
- Usa `useInView`. Renderiza sempre um `<div>` com classe `reveal` + (`is-visible`
  quando `inView`) + `className`. Encaminha o ref do `useInView`. (Sem prop `as`:
  polimorfismo com ref daria atrito de tipos e não é necessário.)
- Teste: renderiza children; ganha `is-visible` quando o mock de IO reporta entrada.

### 2.5 CSS em `src/index.css`
```css
.reveal {
  opacity: 0;
  transform: translateY(16px);
  transition:
    opacity 0.5s ease-out,
    transform 0.5s ease-out;
}
.reveal.is-visible {
  opacity: 1;
  transform: none;
}

/* Stagger: cada filho recebe --i inline (0,1,2...) */
.reveal-stagger > .reveal {
  transition-delay: calc(var(--i, 0) * 60ms);
}

/* Sublinhado animado (links, não botões) */
.link-underline {
  background-image: linear-gradient(currentColor, currentColor);
  background-size: 0% 1px;
  background-position: 0 100%;
  background-repeat: no-repeat;
  transition: background-size 0.3s ease;
}
.link-underline:hover,
.link-underline:focus-visible,
.link-underline.is-active {
  background-size: 100% 1px;
}
```
O bloco `@media (prefers-reduced-motion)` e `.a11y-reduce-motion` já existentes zeram
essas transições; nesse caso o elemento simplesmente aparece/sublinha sem transição.
Adicionar também `html { scroll-behavior: smooth; }` (o reduced-motion já reverte para
`auto`).

## 3. Mudanças por área

### 3.1 Hero — `src/sections/Hero.tsx`
- **Linha de valor** abaixo de `profile.role`, via i18n `hero.tagline` (texto confirmado):
  - PT: "Transformo problemas difíceis em interfaces rápidas, acessíveis e confiáveis."
  - EN: "I turn hard problems into fast, accessible, reliable interfaces."
- **Hierarquia de botões:**
  - Primário (cheio, estilo atual do "Ver projetos"): **Ver projetos**.
  - Secundários (contorno, estilo atual): **Currículo** e **Contato**.
  - **LinkedIn e GitHub**: botões de ícone (SVG inline novo, padrão `iconProps` de
    `HeaderControls`), com nome acessível (`aria-label` ou `<span className="sr-only">`).
    Continuam usando `ExternalLink` (rel/target corretos).
- **Entrada em stagger:** contêiner `.reveal-stagger`; filhos (h1 nome, p cargo, p
  tagline, p localização, `<nav>` de botões) recebem classe `reveal` + `--i` inline.
  Dispara na montagem (Hero está acima da dobra): um `useEffect` no mount adiciona
  `is-visible` no próximo frame (rAF). ~450ms cada, 60ms de stagger, ease-out.
  Neutralizado por reduced-motion.
- Testes atualizados: tagline PT/EN presente; um único botão primário; ícones com nome
  acessível.

### 3.2 Faixa de números — dentro de `src/sections/About.tsx`
- Posição confirmada: **no fim da seção "Sobre"** (ordem de leitura: quem sou → números
  → trajetória na seção seguinte). Sem novo `<Section>` e sem novo link de nav.
- 4 stats curados e verificáveis:
  | valor | prefixo/sufixo | label PT | label EN |
  |---|---|---|---|
  | 100 | — | Lighthouse | Lighthouse score |
  | 5 | `+` | anos em TI e suporte | years in IT & support |
  | 15 | `−` / `%` | tempo de diagnóstico de falhas | fault-diagnosis time |
  | 20 | `−` / `%` | tempo de manutenção preventiva | preventive maintenance time |
- Dados em `src/data/stats.ts`:
  `export const STATS: { value: number; prefix?: string; suffix?: string; labelKey: keyof Strings['stats'] }[]`.
- Labels em i18n: `stats: { lighthouse, years, diagnosis, maintenance }`.
- Componente: `<ul>` com 4 itens; número grande = `useCountUp(value, inView)` onde
  `inView` vem de um `useInView` na faixa inteira (um observer só). Prefixo/sufixo
  estáticos ao redor.
- Teste atualizado em `About.test.tsx`: valores e labels aparecem (com mock de IO
  reportando visível, o número final deve bater).

### 3.3 Scroll-reveal nas seções — `src/components/Section.tsx`
- `<Section>` envolve **apenas `{children}`** num `<Reveal>`. O `<h2>` do título fica
  estático (evita o cabeçalho "pulando" e mantém âncora/`aria-labelledby` estáveis).
- **Todas as 7 seções que usam `<Section>`** (Game, About, Experience, Skills, Projects,
  Ask, Contact) ganham o efeito. Hero tem o stagger próprio.
- **Revisão pós-implementação (2026-09-09):** a decisão anterior era deixar o Game de
  fora do reveal, mas `Game.tsx` usa `<Section id="jogo">` e o usuário optou por manter
  o reveal também no jogo (consistência visual, sem prop de opt-out).
- Seção já visível no load aparece na hora (IO dispara imediato para quem já
  intersecta).
- `Section` não tem teste próprio hoje; adicionar um simples (renderiza título +
  children; com mock de IO fica `is-visible`).

### 3.4 Scroll-spy na nav — `src/App.tsx` (+ `useScrollSpy`)
- `useScrollSpy(['jogo','sobre','experiencia','competencias','projetos','pergunte','contato'])`.
- Link ativo: `aria-current="true"` + `text-neutral-900 dark:text-neutral-100` +
  modificador `.is-active` no `.link-underline` (fixa `background-size: 100% 1px`).
  Demais links continuam apagados (`text-neutral-600 dark:text-neutral-400`).
- Underline animado (`.link-underline`) aplicado também aos links da nav, de contato
  (`Contact.tsx`), de projeto (`Projects.tsx`) e a links em prosa.
- `scroll-behavior: smooth` no `html`.
- Teste atualizado em `App.test.tsx`: com o mock de IO reportando uma seção, o link
  correspondente recebe `aria-current`.

## 4. Testes e infraestrutura

- `src/test/setup.ts`: adicionar mocks de `IntersectionObserver` (com controle manual
  de entradas para os testes) e de `window.matchMedia` (retornando `matches: false`
  por padrão; testes de reduced-motion sobrescrevem).
- Novos arquivos de teste: `useInView.test.ts`, `useCountUp.test.ts`,
  `useScrollSpy.test.ts`, `Reveal.test.tsx`, `Section.test.tsx`.
- Atualizados: `Hero.test.tsx`, `About.test.tsx`, `App.test.tsx`.
- `npm run lint`, `npm run typecheck`, `npm run test`, `npm run build` verdes.
- Verificação manual: Lighthouse ~99/100 (técnica CDP já documentada em
  `tecnicas-portfolio.md`); com reduced-motion ligado (widget + SO) nada some, sem
  layout shift, sem animação.

## 5. Fora de escopo

- Nenhuma biblioteca de animação.
- Sem menu de navegação mobile (nav continua desktop-only como hoje).
- Sem parallax, scroll-hijack, fundo em canvas/vídeo.
- Sem reestruturar os dados da Experiência (a faixa de números cobre os -15%/-20%).
- Sem mudanças no jogo, no "Pergunte sobre mim" ou no CV.

## 6. Fechamento (pós-implementação)

- Conventional Commits.
- Bump para **1.10.0** em `package.json`.
- Entrada no `CHANGELOG.md` (formato Keep a Changelog, seção "Adicionado").
- Tag Git `v1.10.0` (sem GitHub Release), conforme `versionamento-tags.md`.

## 7. Decisões fechadas (2ª sessão, 2026-09-09)

1. **Tagline:** foco em valor. PT "Transformo problemas difíceis em interfaces rápidas,
   acessíveis e confiáveis." / EN "I turn hard problems into fast, accessible, reliable
   interfaces."
2. **Game no scroll-reveal:** ~~não~~ **sim** (revertido na revisão pós-implementação de
   2026-09-09, a pedido do usuário). Todas as 7 seções recebem o reveal.
3. **Faixa de números:** no fim da seção "Sobre".
4. **Verificação visual:** ao vivo via Playwright MCP (Opera GX, perfil "Teste com
   claude", porta 9222) durante a implementação. Screenshots do `npm run dev`.
