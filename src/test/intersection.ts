type MockEntry = { target: Element; isIntersecting: boolean }

interface Registered {
  callback: IntersectionObserverCallback
  elements: Set<Element>
  instance: IntersectionObserver
}

const registry: Registered[] = []

export class MockIntersectionObserver implements IntersectionObserver {
  readonly root = null
  readonly rootMargin = ''
  readonly thresholds: ReadonlyArray<number> = []
  private entry: Registered

  constructor(callback: IntersectionObserverCallback) {
    this.entry = { callback, elements: new Set(), instance: this }
    registry.push(this.entry)
  }

  observe(target: Element): void {
    this.entry.elements.add(target)
  }

  unobserve(target: Element): void {
    this.entry.elements.delete(target)
  }

  disconnect(): void {
    this.entry.elements.clear()
    const index = registry.indexOf(this.entry)
    if (index !== -1) registry.splice(index, 1)
  }

  takeRecords(): IntersectionObserverEntry[] {
    return []
  }
}

function makeEntry(
  target: Element,
  isIntersecting: boolean,
): IntersectionObserverEntry {
  return {
    target,
    isIntersecting,
    intersectionRatio: isIntersecting ? 1 : 0,
    boundingClientRect: target.getBoundingClientRect(),
    intersectionRect: target.getBoundingClientRect(),
    rootBounds: null,
    time: 0,
  }
}

export function fireIntersection(entries: boolean | MockEntry[]): void {
  for (const registered of [...registry]) {
    let payload: IntersectionObserverEntry[]
    if (typeof entries === 'boolean') {
      payload = [...registered.elements].map((target) =>
        makeEntry(target, entries),
      )
    } else {
      payload = entries
        .filter((entry) => registered.elements.has(entry.target))
        .map((entry) => makeEntry(entry.target, entry.isIntersecting))
    }
    if (payload.length > 0) {
      registered.callback(payload, registered.instance)
    }
  }
}

export function resetIntersection(): void {
  registry.length = 0
}
