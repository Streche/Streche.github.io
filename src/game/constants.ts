/**
 * Constantes do mini-game. Unidades: posições em px, tempo em segundos,
 * velocidades em px/s, gravidade em px/s². Resolução interna do canvas fixa
 * (escalada por CSS para ficar responsiva).
 */
export const GAME = {
  width: 800,
  height: 240,
  /** Linha do chão (y). */
  groundY: 200,
  /** Aceleração da gravidade. */
  gravity: 2200,
  /** Velocidade vertical aplicada no pulo (negativa = para cima). */
  jumpVelocity: -760,
  player: {
    x: 60,
    width: 28,
    height: 36,
  },
  obstacle: {
    minHeight: 40,
    maxHeight: 62,
    /** Proporção largura/altura do sprite do cacto (117x160). */
    aspect: 117 / 160,
    /** Distância (px) entre obstáculos. */
    gapMin: 320,
    gapMax: 620,
  },
  speed: {
    initial: 320,
    max: 680,
    /** Quanto a velocidade cresce por segundo de jogo. */
    acceleration: 14,
  },
  /** Pontos por segundo. */
  scoreRate: 10,
} as const
