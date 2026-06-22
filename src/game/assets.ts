/**
 * Carregamento das imagens do jogo (sprites Kenney, CC0).
 * As imagens carregam de forma assíncrona; o render checa `isReady` e usa
 * um fallback (retângulos) enquanto elas não estão prontas.
 */
export interface GameAssets {
  background: HTMLImageElement
  ground: HTMLImageElement
  playerStand: HTMLImageElement
  playerWalk1: HTMLImageElement
  playerWalk2: HTMLImageElement
  playerJump: HTMLImageElement
  playerHurt: HTMLImageElement
  cactus: HTMLImageElement
}

function loadImage(src: string): HTMLImageElement {
  const image = new Image()
  image.src = src
  return image
}

/** Cria os elementos de imagem e inicia o carregamento. Só use no browser. */
export function loadGameAssets(base = '/game/'): GameAssets {
  return {
    background: loadImage(`${base}background.png`),
    ground: loadImage(`${base}ground.png`),
    playerStand: loadImage(`${base}player_stand.png`),
    playerWalk1: loadImage(`${base}player_walk1.png`),
    playerWalk2: loadImage(`${base}player_walk2.png`),
    playerJump: loadImage(`${base}player_jump.png`),
    playerHurt: loadImage(`${base}player_hurt.png`),
    cactus: loadImage(`${base}cactus.png`),
  }
}

/** Verdadeiro quando a imagem terminou de carregar e pode ser desenhada. */
export function isReady(image: HTMLImageElement): boolean {
  return image.complete && image.naturalWidth > 0
}
