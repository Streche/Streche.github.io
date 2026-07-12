# Changelog

Todas as mudanças notáveis deste projeto são registradas aqui.

O formato é baseado em [Keep a Changelog](https://keepachangelog.com/pt-BR/1.1.0/)
e o projeto segue [Versionamento Semântico](https://semver.org/lang/pt-BR/).

## [1.5.0] - 2026-07-12

### Adicionado

- Botão "Baixar CV" no Hero e no Contato, abrindo uma página de currículo (PT/EN)
  gerada a partir dos dados do site e otimizada para "Salvar como PDF" (A4). Contato
  do CV limitado ao e-mail, por privacidade.

## [1.4.1] - 2026-07-12

### Alterado

- Marcris (Experiência e "Sobre mim"): removida a menção a liderança de equipe;
  incluída a responsabilidade pelo controle e manutenção de aparelhos eletrônicos.

## [1.4.0] - 2026-07-12

### Adicionado

- Seção "Experiência" com dois blocos: experiência profissional (YMCA/EUA, Marcris,
  Linkcell/Samsung) e formação acadêmica (Estácio, Senac RJ, ensino médio).

### Corrigido

- "Sobre mim": a formação na Estácio passa a constar como "Graduação em Sistemas de
  Informação" (antes constava, por engano, "pós-graduação em Information Technology").

## [1.3.0] - 2026-07-11

### Adicionado

- Duplas ocasionais de cactos no mini-game, sempre transponíveis num pulo,
  ficando mais frequentes conforme o jogo acelera.
- Regra de "uma leva por vez": uma nova leva de obstáculos só surge depois que a
  anterior sai da tela.

### Alterado

- Mini-game reequilibrado: obstáculos e pulo mais rápidos, com a dificuldade
  subindo gradualmente ao longo da partida.

## [1.2.2] - 2026-07-11

### Alterado

- Ajuste de norma culta no texto de contato: "Me encontre" passa a "Encontre-me"
  (evita iniciar a frase com pronome átono).

## [1.2.1] - 2026-07-11

### Alterado

- Tema padrão na primeira visita passa a ser sempre escuro (letras claras),
  independente da preferência do sistema operacional. A escolha do usuário
  continua sendo salva e respeitada.

## [1.2.0] - 2026-07-11

### Adicionado

- Botão "Ver mais / Ver menos" em cada card de competências, revelando as demais
  competências além das 5 principais.
- Seção "Sobre mim" reorganizada em card, com "Ver mais" para exibir o último
  parágrafo.

## [1.1.0] - 2026-07-09

### Adicionado

- Competências ampliadas: novas linguagens de front-end e back-end, bancos de
  dados e ferramentas de desenvolvimento.
- Seção "Competências" redesenhada em cards (um por categoria), cada um com um
  ícone à esquerda e as 5 competências principais em destaque.

### Alterado

- Seção "Sobre mim" reescrita com tom mais pessoal e humano (PT e EN).
- Padrão de escrita dos textos passa a usar pontuação comum (vírgula, parênteses,
  ponto) no lugar de travessões.

## [1.0.0] - 2026-06-22

Primeira versão publicada do portfólio no GitHub Pages.

### Adicionado

- Estrutura do portfólio: hero, sobre mim, competências, projetos e contato.
- Suporte a dois idiomas (PT/EN) e alternância de tema claro/escuro com i18n.
- Mini-game 2D em canvas, com recorde pessoal salvo no navegador.
- Carrossel de projetos com setas inteligentes e navegação por rolagem.
- Deploy automático no GitHub Pages via GitHub Actions.
- Cabeçalhos de segurança (CSP e referrer-policy) e favicon próprio com og:image.
- Cobertura de testes das seções e da lógica do mini-game.

[1.3.0]: https://github.com/Streche/Streche.github.io/releases/tag/v1.3.0
[1.2.2]: https://github.com/Streche/Streche.github.io/releases/tag/v1.2.2
[1.2.1]: https://github.com/Streche/Streche.github.io/releases/tag/v1.2.1
[1.2.0]: https://github.com/Streche/Streche.github.io/releases/tag/v1.2.0
[1.1.0]: https://github.com/Streche/Streche.github.io/releases/tag/v1.1.0
[1.0.0]: https://github.com/Streche/Streche.github.io/releases/tag/v1.0.0
