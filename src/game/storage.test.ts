import { createScoreStorage } from './storage'

type MinimalStorage = Pick<Storage, 'getItem' | 'setItem'>

function memoryStorage(initial: Record<string, string> = {}): MinimalStorage & {
  map: Map<string, string>
} {
  const map = new Map(Object.entries(initial))
  return {
    map,
    getItem: (key) => map.get(key) ?? null,
    setItem: (key, value) => {
      map.set(key, value)
    },
  }
}

const KEY = 'test:highscore'

describe('createScoreStorage', () => {
  it('load retorna 0 quando não há valor salvo', () => {
    const store = createScoreStorage(memoryStorage(), KEY)
    expect(store.load()).toBe(0)
  })

  it('load lê um valor válido', () => {
    const store = createScoreStorage(memoryStorage({ [KEY]: '42' }), KEY)
    expect(store.load()).toBe(42)
  })

  it('load retorna 0 para valores inválidos ou negativos', () => {
    expect(
      createScoreStorage(memoryStorage({ [KEY]: 'abc' }), KEY).load(),
    ).toBe(0)
    expect(createScoreStorage(memoryStorage({ [KEY]: '-5' }), KEY).load()).toBe(
      0,
    )
  })

  it('save grava o valor arredondado para baixo', () => {
    const mem = memoryStorage()
    const store = createScoreStorage(mem, KEY)
    store.save(99.9)
    expect(mem.map.get(KEY)).toBe('99')
  })

  it('não lança exceção se o storage falhar (ex.: modo privado)', () => {
    const throwing: MinimalStorage = {
      getItem: () => {
        throw new Error('bloqueado')
      },
      setItem: () => {
        throw new Error('bloqueado')
      },
    }
    const store = createScoreStorage(throwing, KEY)
    expect(() => store.save(10)).not.toThrow()
    expect(store.load()).toBe(0)
  })
})
