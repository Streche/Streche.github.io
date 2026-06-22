import type { ScoreStorage } from './types'

export const HIGH_SCORE_KEY = 'streche:portfolio:highscore'

/**
 * Persistência do recorde no localStorage, tolerante a falhas:
 * - valores inválidos/corrompidos viram 0;
 * - exceções (ex.: modo privado que bloqueia storage) são ignoradas.
 * `storage` é injetável para facilitar os testes.
 */
export function createScoreStorage(
  storage: Pick<Storage, 'getItem' | 'setItem'> = localStorage,
  key: string = HIGH_SCORE_KEY,
): ScoreStorage {
  return {
    load() {
      try {
        const raw = storage.getItem(key)
        if (raw === null) return 0
        const value = Number.parseInt(raw, 10)
        return Number.isFinite(value) && value >= 0 ? value : 0
      } catch {
        return 0
      }
    },
    save(score) {
      try {
        storage.setItem(key, String(Math.max(0, Math.floor(score))))
      } catch {
        // Ambiente sem localStorage disponível — ignora silenciosamente.
      }
    },
  }
}
