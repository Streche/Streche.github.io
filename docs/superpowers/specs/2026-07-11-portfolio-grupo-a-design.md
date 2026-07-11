# Design — Grupo A do portfólio (Experiência + CV + Estudos de caso)

Data: 2026-07-11
Status: **rascunho para revisão** (continuar em 2026-07-12)
Escopo: incremento "Grupo A". O Assistente de IA fica para um incremento separado (Grupo B).

## 1. Contexto e objetivo

O portfólio (React + Vite + TypeScript + Tailwind, i18n PT/EN, deploy no GitHub
Pages, v1.3.0) tem hoje: Hero, Mini-game, Sobre, Competências, Projetos, Contato.

A pesquisa (2025/2026) apontou lacunas que recrutadores esperam: **Experiência**,
**CV para download** e **narrativa dos projetos** (problema → solução → resultado).
Objetivo do Grupo A: fechar essas três lacunas, mantendo o padrão do site
(dados em `profile.ts` + componente de seção + i18n), sem quebrar o que já existe.

## 2. Correção de dados (bloqueante, confirmar)

Os **dois currículos** do usuário dizem **"Graduação em Sistemas de Informação"**
na Estácio (previsão 2025.1). O site (e o LinkedIn) hoje dizem
**"Pós-graduação em Information Technology"** — provável erro herdado do LinkedIn.

- **Ação:** corrigir o parágrafo 3 do "Sobre mim" (PT/EN) em `profile.ts` para
  "Graduação em Sistemas de Informação (Estácio, previsão 2025.1)".
- **Confirmar com o usuário** antes de publicar (é uma afirmação factual de credencial).

## 3. Feature 1 — Seção "Experiência" (estrutura B: dois blocos)

Nova seção, dois blocos: **Experiência profissional** e **Formação acadêmica**,
em ordem cronológica reversa. Fonte: `Resume_Carlos_Dev.pdf` (dados reais).

Experiência profissional:
- **YMCA — Estados Unidos** · Instrutor e Orientador · Trabalho temporário, 2025 ·
  ambiente multicultural, suporte a 50+ participantes.
- **Marcris Serviços** · Auxiliar Técnico em Eletrônica / Supervisor · 2022–2025 ·
  microeletrônica e CIs para sistemas embarcados; liderou 5 técnicos; −15% no tempo
  de diagnóstico de falhas.
- **Linkcell Celulares / Samsung** · Auxiliar Administrativo e Técnico · 2020–2022 ·
  suporte Samsung; −20% no tempo de manutenção preventiva.

Formação acadêmica:
- **Universidade Estácio de Sá** · Graduação em Sistemas de Informação · previsão 2025.1
- **Senac RJ** · Técnico em Desenvolvimento Web · 2018–2019
- **C.E. Duque Costa** · Ensino Médio · 2018
- Destaque: **Work and Travel (Camp Leaders)** · EUA · 2025

Design técnico:
- Adicionar ao modelo `Profile` (em `src/data/profile.ts`): `experience: ExperienceItem[]`
  e `education: EducationItem[]`, ambos localizados (PT/EN) como os demais campos.
  `ExperienceItem = { role, org, period, bullets: string[] }`.
  `EducationItem = { course, org, period }`.
- Novo componente `src/sections/Experience.tsx` reutilizando `Section`, com dois
  sub-blocos (timeline vertical simples: cargo/curso, org, período, bullets).
- Strings i18n: títulos "Experiência profissional / Professional experience" e
  "Formação acadêmica / Education".
- Posição na página: **depois de "Sobre mim", antes de "Competências"** (fluxo
  currículo: quem sou → trajetória → o que sei). Atualizar o menu de navegação.
- Testes: renderização dos blocos e itens (padrão dos testes atuais).

## 4. Feature 2 — Botão "Baixar CV" (por idioma)

- Arquivos em `public/`: `cv/carlos-eduardo-en.pdf` (= `Resume_Carlos_Dev.pdf`,
  já forte) e `cv/carlos-eduardo-pt.pdf` (**a criar**: versão PT à altura da dev,
  traduzida e já com a Estácio correta).
- Botão de download que serve o PDF conforme o idioma ativo (`lang` do i18n):
  PT → pt.pdf, EN → en.pdf. `download` + `rel="noopener"`.
- Posição: no **Hero** (ao lado de "Ver projetos"/"Contato") e/ou na seção Contato.
  Decidir na revisão; recomendação: Hero (visível nos primeiros 15s).
- i18n: rótulo "Baixar CV / Download CV".
- Observação: PDFs são servidos pelo mesmo domínio → compatível com a CSP atual.

## 5. Feature 3 — Estudos de caso dos projetos

### Varredura do GitHub (github.com/Streche) — critério de recrutador sênior
8 repositórios:
- **Streche.github.io** — TypeScript, ativo. O próprio portfólio. **Forte.** ✅
- **projeto** — CakePHP (MVC, PHPUnit, CI/Travis), 2020–2023. Real, mas README é o
  **boilerplate padrão** (não diz o que faz), CakePHP 3.x antigo, sem demo, fora da
  stack atual. ⚠️ Reaproveitável só com trabalho (documentar + demo).
- **Jokenpo** (JS, 2019) — pedra-papel-tesoura, nível iniciante. ❌
- **aula_ionic** (2019) — exercício de aula (Ionic). ❌
- **projinteligenciaetecnologia** (PHP, 2019) — trabalho escolar pequeno. ❌
- **hibernate.java**, **trabalhophp**, **trabalhohphp** — **vazios (0 KB)**. ❌

Conclusão: fora o portfólio, quase não há material antigo que ajude; boa parte é
coursework de 2019 e 3 repos **vazios** que **atrapalham** a imagem do perfil.

### Recomendação (a decidir na revisão)
- **Agora:** transformar o **próprio portfólio** num estudo de caso bem-feito
  (problema → solução → resultado; destaques: mini-game em canvas, i18n, tema,
  testes 44+, CI/CD, hardening de segurança) e deixar a **estrutura pronta** para
  novos projetos.
- **Opcional:** resgatar **`projeto` (CakePHP)** como 2º caso — exige documentar o
  que a app faz + subir um demo. Decidir se vale.
- **Bônus de recrutador (fora do site):** **limpar o GitHub** — apagar/arquivar os
  repos vazios e triviais e fixar (pin) o portfólio. Perfil enxuto > perfil cheio.
- **Futuro (Grupo C?):** construir 1–2 projetos novos e reais (recrutadores querem
  3–5 apps funcionando) — vira um incremento próprio.

Design técnico (estudo de caso):
- Estender o tipo `Project` em `profile.ts` com campos opcionais localizados:
  `problem`, `solution`, `results` (e talvez `highlights: string[]`).
- UI: expandir o card do projeto (ou uma visão de detalhe) mostrando esses campos.
  Reusar o padrão de "Ver mais" já existente para não poluir.

## 6. Não-objetivos (deste incremento)
- Assistente de IA "Pergunte sobre mim" (Grupo B — precisa de backend/serverless,
  chave de API, ajuste de CSP e tem custo).
- Construir projetos novos do zero (possível Grupo C).

## 7. Decisões em aberto para 2026-07-12
1. Confirmar credencial da Estácio (**Graduação em Sistemas de Informação**?).
2. Estudos de caso: só o portfólio agora, ou também resgatar o `projeto` CakePHP?
3. Quer que eu já limpe o GitHub (apagar repos vazios/triviais e fixar o bom)?
4. Posição do botão "Baixar CV": Hero, Contato, ou ambos?
5. Ordem de implementação sugerida: (1) Experiência + correção Estácio → v1.4.0;
   (2) CV bilíngue → v1.5.0; (3) Estudos de caso → v1.6.0. OK dividir assim?

## 8. Plano de versões (proposto)
- v1.4.0 — Seção Experiência + correção da Estácio no "Sobre mim".
- v1.5.0 — Botão "Baixar CV" por idioma (EN pronto + PT novo).
- v1.6.0 — Estudos de caso (portfólio + estrutura; opcional `projeto`).
