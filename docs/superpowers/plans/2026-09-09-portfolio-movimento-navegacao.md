# v1.10.0 "Movimento e navegação" Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add sober scroll motion (reveal-on-scroll, count-up stats, animated underlines), a stronger Hero (value line, button hierarchy, entrance stagger), and nav scroll-spy to the portfolio, with zero new runtime dependencies.

**Architecture:** Three tiny custom hooks (`useInView`, `useCountUp`, `useScrollSpy`) built on `IntersectionObserver` + `requestAnimationFrame`, a `<Reveal>` wrapper baked into `<Section>`, and CSS classes (`.reveal`, `.link-underline`) in `src/index.css`. All motion is neutralized by the project's existing reduced-motion handling (`@media (prefers-reduced-motion)` + `.a11y-reduce-motion` class); the count-up hook checks it explicitly.

**Tech Stack:** React 19, TypeScript (strict), Tailwind CSS v4 (CSS-first, no config), Vite 8, Vitest + Testing Library, ESLint flat config, Prettier (no semicolons, single quotes, 2-space), Husky + commitlint (Conventional Commits).

## Global Constraints

- **No new dependencies.** Nothing added to `package.json`. Motion is CSS + hooks only.
- **Prettier style, verbatim:** no semicolons, single quotes, 2-space indent, trailing commas in multiline. Run `npx prettier --write <files>` before every commit.
- **Reduced motion:** every animation must be invisible when either `@media (prefers-reduced-motion: reduce)` matches or `<html>` has class `a11y-reduce-motion`. CSS transitions/animations are already neutralized by blocks in `src/index.css`; JS (`useCountUp`, Hero stagger) must check `prefersReducedMotion()` and skip to the end state.
- **Accessibility:** content must be present in the DOM and reachable regardless of animation state (never gate text behind opacity for assistive tech beyond the CSS reveal, which has reduced-motion fallbacks).
- **CSP:** GitHub Pages with `script-src 'self'`. No CDNs, no external anything. (Nothing here needs it; stated for context.)
- **i18n:** every user-facing string goes through `src/i18n/strings.ts` — add to the `Strings` interface and to both `pt` and `en`.
- **Commits:** Conventional Commits, lowercase subject, no trailing period. Husky pre-commit runs lint-staged; commit-msg runs commitlint.
- **Quality gate (Task 12):** `npm run lint`, `npm run typecheck`, `npm run test`, `npm run build` all green.
- **Versioning:** bump `package.json` to `1.10.0`, add a `## [1.10.0]` section to `CHANGELOG.md` (Keep a Changelog, "Adicionado"), create git tag `v1.10.0`. No GitHub Release.
- **Branch:** work on `feat/v1.10-movimento` unless the user says to commit straight to `main` (their usual flow). Confirm at execution start.

---

### Task 1: Test infrastructure — IntersectionObserver + matchMedia mocks

**Files:**
- Create: `src/test/intersection.ts`
- Create: `src/test/intersection.test.ts`
- Modify: `src/test/setup.ts`

**Interfaces:**
- Consumes: nothing.
- Produces:
  - `class MockIntersectionObserver` (installed globally in tests)
  - `fireIntersection(entries: boolean | { target: Element; isIntersecting: boolean }[]): void` — drives observer callbacks. `true`/`false` applies to every observed element of every live observer; an array applies only to matching observed targets.
  - `resetIntersection(): void` — clears the observer registry (called in `afterEach`).

- [ ] **Step 1: Write the failing test**

Create `src/test/intersection.test.ts`:

```ts
import { fireIntersection, resetIntersection } from './intersection'

describe('mock IntersectionObserver', () => {
  it('entrega os alvos observados para o callback via fireIntersection(true)', () => {
    const seen: boolean[] = []
    const observer = new IntersectionObserver((entries) => {
      for (const entry of entries) seen.push(entry.isIntersecting)
    })
    const el = document.createElement('div')
    observer.observe(el)

    fireIntersection(true)
    expect(seen).toEqual([true])

    observer.disconnect()
    fireIntersection(true)
    expect(seen).toEqual([true])

    resetIntersection()
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm run test -- src/test/intersection.test.ts`
Expected: FAIL — `Cannot find module './intersection'`.

- [ ] **Step 3: Create the mock**

Create `src/test/intersection.ts`:

```ts
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

function makeEntry(target: Element, isIntersecting: boolean): IntersectionObserverEntry {
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

export function fireIntersection(
  entries: boolean | MockEntry[],
): void {
  for (const registered of [...registry]) {
    let payload: IntersectionObserverEntry[]
    if (typeof entries === 'boolean') {
      payload = [...registered.elements].map((target) => makeEntry(target, entries))
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
```

- [ ] **Step 4: Wire the mocks into the global setup**

Modify `src/test/setup.ts` to its full new contents:

```ts
// Setup global de testes: adiciona os matchers do jest-dom (toBeInTheDocument, etc.),
// instala mocks de IntersectionObserver e matchMedia e limpa o DOM entre os testes.
import '@testing-library/jest-dom/vitest'
import { afterEach } from 'vitest'
import { cleanup } from '@testing-library/react'
import { MockIntersectionObserver, resetIntersection } from './intersection'

// jsdom não implementa o contexto 2D do canvas. Retornamos null silenciosamente
// (o hook do jogo já trata esse caso) para evitar avisos ruidosos nos testes.
HTMLCanvasElement.prototype.getContext = (() =>
  null) as typeof HTMLCanvasElement.prototype.getContext

// jsdom não implementa IntersectionObserver nem matchMedia.
globalThis.IntersectionObserver =
  MockIntersectionObserver as unknown as typeof IntersectionObserver

if (typeof window.matchMedia !== 'function') {
  window.matchMedia = ((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => false,
  })) as typeof window.matchMedia
}

afterEach(() => {
  cleanup()
  resetIntersection()
  document.documentElement.classList.remove('a11y-reduce-motion')
  document.documentElement.style.fontSize = ''
})
```

- [ ] **Step 5: Run the new test and the whole suite**

Run: `npm run test`
Expected: PASS — the new `intersection.test.ts` passes and every pre-existing test still passes (the mocks are inert unless a test opts in).

- [ ] **Step 6: Lint + format + commit**

```bash
npx prettier --write src/test/intersection.ts src/test/intersection.test.ts src/test/setup.ts
npm run lint
git add src/test/intersection.ts src/test/intersection.test.ts src/test/setup.ts
git commit -m "test: add IntersectionObserver and matchMedia mocks"
```

---

### Task 2: `useInView` hook

**Files:**
- Create: `src/hooks/useInView.ts`
- Create: `src/hooks/useInView.test.ts`

**Interfaces:**
- Consumes: `fireIntersection` from `src/test/intersection.ts` (tests only).
- Produces: `useInView<T extends Element = HTMLElement>(): { ref: (node: T | null) => void; inView: boolean }`. `inView` starts `false`, flips to `true` the first time the element intersects, and stays `true` forever after (observer disconnects). If `IntersectionObserver` is undefined, `inView` is `true` immediately.

- [ ] **Step 1: Write the failing test**

Create `src/hooks/useInView.test.ts`:

```ts
import { renderHook, act } from '@testing-library/react'
import { useInView } from './useInView'
import { fireIntersection } from '../test/intersection'

describe('useInView', () => {
  it('começa invisível e fica visível ao entrar na viewport', () => {
    const { result } = renderHook(() => useInView<HTMLDivElement>())
    const element = document.createElement('div')

    act(() => {
      result.current.ref(element)
    })
    expect(result.current.inView).toBe(false)

    act(() => {
      fireIntersection(true)
    })
    expect(result.current.inView).toBe(true)
  })

  it('permanece visível depois de sair da viewport (revela uma vez)', () => {
    const { result } = renderHook(() => useInView<HTMLDivElement>())
    const element = document.createElement('div')

    act(() => {
      result.current.ref(element)
    })
    act(() => {
      fireIntersection(true)
    })
    act(() => {
      fireIntersection(false)
    })
    expect(result.current.inView).toBe(true)
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm run test -- src/hooks/useInView.test.ts`
Expected: FAIL — `Cannot find module './useInView'`.

- [ ] **Step 3: Write the implementation**

Create `src/hooks/useInView.ts`:

```ts
import { useCallback, useRef, useState } from 'react'

const OPTIONS: IntersectionObserverInit = {
  threshold: 0.15,
  rootMargin: '0px 0px -10% 0px',
}

/**
 * Observa um elemento e reporta quando ele entra na viewport pela primeira vez.
 * Revela uma vez só: depois de `inView` virar true, o observer é desconectado e
 * o valor não volta atrás. Sem IntersectionObserver (SSR/navegador antigo), o
 * conteúdo é considerado visível imediatamente.
 */
export function useInView<T extends Element = HTMLElement>() {
  const [inView, setInView] = useState(false)
  const observerRef = useRef<IntersectionObserver | null>(null)

  const ref = useCallback((node: T | null) => {
    observerRef.current?.disconnect()
    observerRef.current = null
    if (node === null) return
    if (typeof IntersectionObserver === 'undefined') {
      setInView(true)
      return
    }
    const observer = new IntersectionObserver((entries) => {
      if (entries.some((entry) => entry.isIntersecting)) {
        setInView(true)
        observer.disconnect()
        observerRef.current = null
      }
    }, OPTIONS)
    observer.observe(node)
    observerRef.current = observer
  }, [])

  return { ref, inView }
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm run test -- src/hooks/useInView.test.ts`
Expected: PASS (both cases).

- [ ] **Step 5: Lint + format + commit**

```bash
npx prettier --write src/hooks/useInView.ts src/hooks/useInView.test.ts
npm run lint
git add src/hooks/useInView.ts src/hooks/useInView.test.ts
git commit -m "feat: add useInView hook for reveal-on-scroll"
```

---

### Task 3: `useCountUp` hook

**Files:**
- Create: `src/lib/prefersReducedMotion.ts`
- Create: `src/hooks/useCountUp.ts`
- Create: `src/hooks/useCountUp.test.ts`

**Interfaces:**
- Consumes: nothing from earlier tasks.
- Produces:
  - `prefersReducedMotion(): boolean` — `true` when `<html>` has class `a11y-reduce-motion` OR `window.matchMedia('(prefers-reduced-motion: reduce)').matches`.
  - `useCountUp(target: number, start: boolean, opts?: { durationMs?: number; decimals?: number }): number` — returns `0` until `start` is `true`; then animates `0 → target` with `requestAnimationFrame` + easeOutCubic over `durationMs` (default `1200`), rounded to `decimals` (default `0`). If `prefersReducedMotion()` is true when `start` becomes true, returns `target` immediately.

- [ ] **Step 1: Write the failing test**

Create `src/hooks/useCountUp.test.ts`:

```ts
import { renderHook, waitFor } from '@testing-library/react'
import { useCountUp } from './useCountUp'

describe('useCountUp', () => {
  it('fica em 0 enquanto start é false', () => {
    const { result } = renderHook(() => useCountUp(100, false))
    expect(result.current).toBe(0)
  })

  it('anima até o alvo quando start vira true', async () => {
    const { result } = renderHook(() => useCountUp(50, true, { durationMs: 30 }))
    await waitFor(() => expect(result.current).toBe(50), { timeout: 1000 })
  })

  it('vai direto ao alvo com prefers-reduced-motion (media query)', () => {
    const spy = vi.spyOn(window, 'matchMedia').mockReturnValue({
      matches: true,
      media: '(prefers-reduced-motion: reduce)',
      onchange: null,
      addListener: () => {},
      removeListener: () => {},
      addEventListener: () => {},
      removeEventListener: () => {},
      dispatchEvent: () => false,
    } as MediaQueryList)

    const { result } = renderHook(() => useCountUp(100, true))
    expect(result.current).toBe(100)
    spy.mockRestore()
  })

  it('vai direto ao alvo com a classe a11y-reduce-motion', () => {
    document.documentElement.classList.add('a11y-reduce-motion')
    const { result } = renderHook(() => useCountUp(100, true))
    expect(result.current).toBe(100)
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm run test -- src/hooks/useCountUp.test.ts`
Expected: FAIL — `Cannot find module './useCountUp'`.

- [ ] **Step 3: Write `prefersReducedMotion`**

Create `src/lib/prefersReducedMotion.ts`:

```ts
/**
 * True quando o usuário pediu menos movimento: pela media query do sistema
 * ou pela classe do widget de acessibilidade (`a11y-reduce-motion` no <html>).
 */
export function prefersReducedMotion(): boolean {
  if (typeof document !== 'undefined') {
    if (document.documentElement.classList.contains('a11y-reduce-motion')) {
      return true
    }
  }
  if (typeof window !== 'undefined' && typeof window.matchMedia === 'function') {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches
  }
  return false
}
```

- [ ] **Step 4: Write `useCountUp`**

Create `src/hooks/useCountUp.ts`:

```ts
import { useEffect, useRef, useState } from 'react'
import { prefersReducedMotion } from '../lib/prefersReducedMotion'

interface CountUpOptions {
  durationMs?: number
  decimals?: number
}

/**
 * Anima um número de 0 até `target` quando `start` vira true.
 * Respeita reduced-motion (vai direto ao alvo). Volta a 0 se `start` for false.
 */
export function useCountUp(
  target: number,
  start: boolean,
  opts?: CountUpOptions,
): number {
  const { durationMs = 1200, decimals = 0 } = opts ?? {}
  const [value, setValue] = useState(0)
  const frameRef = useRef(0)

  useEffect(() => {
    if (!start) {
      setValue(0)
      return
    }
    if (prefersReducedMotion()) {
      setValue(target)
      return
    }
    const startTime = performance.now()
    const tick = (now: number) => {
      const progress = Math.min((now - startTime) / durationMs, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      const factor = 10 ** decimals
      setValue(Math.round(target * eased * factor) / factor)
      if (progress < 1) {
        frameRef.current = requestAnimationFrame(tick)
      }
    }
    frameRef.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frameRef.current)
  }, [target, start, durationMs, decimals])

  return value
}
```

- [ ] **Step 5: Run test to verify it passes**

Run: `npm run test -- src/hooks/useCountUp.test.ts`
Expected: PASS (all four cases).

- [ ] **Step 6: Lint + format + commit**

```bash
npx prettier --write src/lib/prefersReducedMotion.ts src/hooks/useCountUp.ts src/hooks/useCountUp.test.ts
npm run lint
git add src/lib/prefersReducedMotion.ts src/hooks/useCountUp.ts src/hooks/useCountUp.test.ts
git commit -m "feat: add useCountUp hook with reduced-motion short-circuit"
```

---

### Task 4: `useScrollSpy` hook

**Files:**
- Create: `src/hooks/useScrollSpy.ts`
- Create: `src/hooks/useScrollSpy.test.ts`

**Interfaces:**
- Consumes: `fireIntersection` from `src/test/intersection.ts` (tests only).
- Produces: `useScrollSpy(ids: readonly string[]): string` — returns `''` until a watched section intersects, then the id of the currently-intersecting section that appears **first** in `ids` order. Elements are looked up with `document.getElementById`. No-op if `IntersectionObserver` is undefined.

- [ ] **Step 1: Write the failing test**

Create `src/hooks/useScrollSpy.test.ts`:

```ts
import { renderHook, act } from '@testing-library/react'
import { useScrollSpy } from './useScrollSpy'
import { fireIntersection } from '../test/intersection'

describe('useScrollSpy', () => {
  it('acompanha a seção ativa respeitando a ordem da lista de ids', () => {
    const first = document.createElement('section')
    first.id = 'first'
    const second = document.createElement('section')
    second.id = 'second'
    document.body.append(first, second)

    const { result } = renderHook(() => useScrollSpy(['first', 'second']))
    expect(result.current).toBe('')

    act(() => {
      fireIntersection([{ target: second, isIntersecting: true }])
    })
    expect(result.current).toBe('second')

    act(() => {
      fireIntersection([{ target: first, isIntersecting: true }])
    })
    expect(result.current).toBe('first')

    act(() => {
      fireIntersection([{ target: first, isIntersecting: false }])
    })
    expect(result.current).toBe('second')

    first.remove()
    second.remove()
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm run test -- src/hooks/useScrollSpy.test.ts`
Expected: FAIL — `Cannot find module './useScrollSpy'`.

- [ ] **Step 3: Write the implementation**

Create `src/hooks/useScrollSpy.ts`:

```ts
import { useEffect, useState } from 'react'

/**
 * Retorna o id da seção "ativa" (a que está no terço superior da viewport).
 * Entre várias visíveis, escolhe a primeira na ordem de `ids`.
 */
export function useScrollSpy(ids: readonly string[]): string {
  const [activeId, setActiveId] = useState('')

  useEffect(() => {
    if (typeof IntersectionObserver === 'undefined') return
    const visible = new Set<string>()
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) visible.add(entry.target.id)
          else visible.delete(entry.target.id)
        }
        const firstVisible = ids.find((id) => visible.has(id))
        if (firstVisible) setActiveId(firstVisible)
      },
      { rootMargin: '-45% 0px -50% 0px' },
    )
    for (const id of ids) {
      const element = document.getElementById(id)
      if (element) observer.observe(element)
    }
    return () => observer.disconnect()
  }, [ids])

  return activeId
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm run test -- src/hooks/useScrollSpy.test.ts`
Expected: PASS.

- [ ] **Step 5: Lint + format + commit**

```bash
npx prettier --write src/hooks/useScrollSpy.ts src/hooks/useScrollSpy.test.ts
npm run lint
git add src/hooks/useScrollSpy.ts src/hooks/useScrollSpy.test.ts
git commit -m "feat: add useScrollSpy hook for active-section tracking"
```

---

### Task 5: CSS classes + `<Reveal>` component

**Files:**
- Modify: `src/index.css` (append, after line 70)
- Create: `src/components/Reveal.tsx`
- Create: `src/components/Reveal.test.tsx`

**Interfaces:**
- Consumes: `useInView` from `src/hooks/useInView.ts`.
- Produces: `<Reveal className?: string; children: ReactNode>` — renders a `<div>` with class `reveal`, adding `is-visible` once it scrolls into view, plus any `className` passed. CSS: `.reveal` fades + slides up 16px over 0.5s; `.is-visible` is the end state; reduced-motion forces the end state with no transition. `.link-underline` grows an underline from 0 to 100% on hover/focus and when `.is-active`.

- [ ] **Step 1: Write the failing test**

Create `src/components/Reveal.test.tsx`:

```tsx
import { render, screen, act } from '@testing-library/react'
import { Reveal } from './Reveal'
import { fireIntersection } from '../test/intersection'

describe('Reveal', () => {
  it('renderiza os filhos e ganha is-visible ao entrar na viewport', () => {
    render(
      <Reveal className="extra">
        <p>conteúdo revelável</p>
      </Reveal>,
    )
    const text = screen.getByText('conteúdo revelável')
    const wrapper = text.parentElement as HTMLElement

    expect(wrapper).toHaveClass('reveal', 'extra')
    expect(wrapper).not.toHaveClass('is-visible')

    act(() => {
      fireIntersection(true)
    })
    expect(wrapper).toHaveClass('is-visible')
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm run test -- src/components/Reveal.test.tsx`
Expected: FAIL — `Cannot find module './Reveal'`.

- [ ] **Step 3: Create the component**

Create `src/components/Reveal.tsx`:

```tsx
import type { ReactNode } from 'react'
import { useInView } from '../hooks/useInView'

interface RevealProps {
  className?: string
  children: ReactNode
}

/** Envolve um bloco e o revela (fade + slide) quando entra na viewport. */
export function Reveal({ className, children }: RevealProps) {
  const { ref, inView } = useInView<HTMLDivElement>()
  const classes = ['reveal', inView ? 'is-visible' : '', className ?? '']
    .filter(Boolean)
    .join(' ')
  return (
    <div ref={ref} className={classes}>
      {children}
    </div>
  )
}
```

- [ ] **Step 4: Append the CSS**

Append to `src/index.css` (after the existing `.a11y-reduce-motion` block, at end of file):

```css

/* --- Movimento (v1.10) --- */

html {
  scroll-behavior: smooth;
}

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

/* Reduced motion: conteúdo sempre visível, sem depender do observer. */
@media (prefers-reduced-motion: reduce) {
  .reveal {
    opacity: 1;
    transform: none;
  }
}
.a11y-reduce-motion .reveal {
  opacity: 1;
  transform: none;
}

/* Sublinhado que cresce da esquerda (links, nunca botões). */
.link-underline {
  background-image: linear-gradient(currentColor, currentColor);
  background-position: 0 100%;
  background-repeat: no-repeat;
  background-size: 0% 1px;
  transition: background-size 0.3s ease;
}
.link-underline:hover,
.link-underline:focus-visible,
.link-underline.is-active {
  background-size: 100% 1px;
}
```

- [ ] **Step 5: Run test to verify it passes**

Run: `npm run test -- src/components/Reveal.test.tsx`
Expected: PASS.

- [ ] **Step 6: Lint + format + commit**

```bash
npx prettier --write src/components/Reveal.tsx src/components/Reveal.test.tsx src/index.css
npm run lint
git add src/components/Reveal.tsx src/components/Reveal.test.tsx src/index.css
git commit -m "feat: add Reveal component and motion CSS"
```

---

### Task 6: `<Section>` reveals its content

**Files:**
- Modify: `src/components/Section.tsx`
- Create: `src/components/Section.test.tsx`

**Interfaces:**
- Consumes: `<Reveal>` from `src/components/Reveal.tsx`.
- Produces: unchanged public props (`id`, `title`, `children`). The `<h2>` stays static; `{children}` is wrapped in `<Reveal>`.

- [ ] **Step 1: Write the failing test**

Create `src/components/Section.test.tsx`:

```tsx
import { render, screen, act } from '@testing-library/react'
import { Section } from './Section'
import { fireIntersection } from '../test/intersection'

describe('Section', () => {
  it('renderiza título e conteúdo, revelando o conteúdo ao entrar na viewport', () => {
    render(
      <Section id="demo" title="Demonstração">
        <p>corpo da seção</p>
      </Section>,
    )

    expect(
      screen.getByRole('heading', { name: 'Demonstração' }),
    ).toBeInTheDocument()

    const body = screen.getByText('corpo da seção')
    const wrapper = body.parentElement as HTMLElement
    expect(wrapper).toHaveClass('reveal')
    expect(wrapper).not.toHaveClass('is-visible')

    act(() => {
      fireIntersection(true)
    })
    expect(wrapper).toHaveClass('is-visible')
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm run test -- src/components/Section.test.tsx`
Expected: FAIL — `expect(wrapper).toHaveClass('reveal')` fails because `<Section>` does not wrap children yet.

- [ ] **Step 3: Modify `Section.tsx`**

Full new contents of `src/components/Section.tsx`:

```tsx
import type { ReactNode } from 'react'
import { Reveal } from './Reveal'

interface SectionProps {
  /** Usado como âncora de navegação e para o aria-labelledby. */
  id: string
  title: string
  children: ReactNode
}

/**
 * Wrapper semântico de seção: garante <section> com cabeçalho acessível
 * (aria-labelledby) e espaçamento consistente em todo o site. O conteúdo é
 * revelado (fade + slide) ao entrar na viewport; o título fica estático.
 */
export function Section({ id, title, children }: SectionProps) {
  const headingId = `${id}-title`
  return (
    <section
      id={id}
      aria-labelledby={headingId}
      className="mx-auto w-full max-w-3xl scroll-mt-20 px-6 py-16"
    >
      <h2
        id={headingId}
        className="mb-6 text-2xl font-bold tracking-tight text-neutral-900 sm:text-3xl dark:text-neutral-100"
      >
        {title}
      </h2>
      <Reveal>{children}</Reveal>
    </section>
  )
}
```

- [ ] **Step 4: Run tests**

Run: `npm run test -- src/components/Section.test.tsx src/sections`
Expected: PASS — the new Section test passes and every existing section test (`About`, `Experience`, `Skills`, `Projects`, `Ask`) still passes (text queries are unaffected by the extra wrapper div).

- [ ] **Step 5: Lint + format + commit**

```bash
npx prettier --write src/components/Section.tsx src/components/Section.test.tsx
npm run lint
git add src/components/Section.tsx src/components/Section.test.tsx
git commit -m "feat: reveal Section content on scroll"
```

---

### Task 7: i18n strings + stats data

**Files:**
- Modify: `src/i18n/strings.ts`
- Create: `src/data/stats.ts`
- Create: `src/data/stats.test.ts`

**Interfaces:**
- Consumes: `Strings` type from `src/i18n/strings.ts`.
- Produces:
  - `strings[lang].hero.tagline: string`
  - `strings[lang].stats: { lighthouse: string; years: string; diagnosis: string; maintenance: string }`
  - `interface Stat { value: number; prefix?: string; suffix?: string; labelKey: keyof Strings['stats'] }`
  - `export const STATS: Stat[]` — 4 entries: `{100,'lighthouse'}`, `{5,'+','years'}`, `{15,'−','%','diagnosis'}`, `{20,'−','%','maintenance'}`.

- [ ] **Step 1: Write the failing test**

Create `src/data/stats.test.ts`:

```ts
import { STATS } from './stats'
import { strings } from '../i18n/strings'

describe('STATS', () => {
  it('tem 4 métricas com valores e labels válidos', () => {
    expect(STATS).toHaveLength(4)
    for (const stat of STATS) {
      expect(typeof stat.value).toBe('number')
      expect(strings.pt.stats[stat.labelKey]).toBeTruthy()
      expect(strings.en.stats[stat.labelKey]).toBeTruthy()
    }
  })

  it('inclui a métrica do Lighthouse e as reduções de tempo', () => {
    const values = STATS.map((stat) => `${stat.prefix ?? ''}${stat.value}${stat.suffix ?? ''}`)
    expect(values).toEqual(['100', '+5', '−15%', '−20%'])
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm run test -- src/data/stats.test.ts`
Expected: FAIL — `Cannot find module './stats'`.

- [ ] **Step 3: Extend the `Strings` interface**

In `src/i18n/strings.ts`, change the `hero` line inside `interface Strings` from:

```ts
  hero: { viewProjects: string; contact: string }
```

to:

```ts
  hero: { viewProjects: string; contact: string; tagline: string }
```

Then, in the same interface, add a `stats` block right after the `hero` line:

```ts
  stats: {
    lighthouse: string
    years: string
    diagnosis: string
    maintenance: string
  }
```

- [ ] **Step 4: Fill both translations**

In `strings.pt`, replace:

```ts
    hero: { viewProjects: 'Ver projetos', contact: 'Contato' },
```

with:

```ts
    hero: {
      viewProjects: 'Ver projetos',
      contact: 'Contato',
      tagline:
        'Transformo problemas difíceis em interfaces rápidas, acessíveis e confiáveis.',
    },
    stats: {
      lighthouse: 'pontos no Lighthouse',
      years: 'anos em TI e suporte',
      diagnosis: 'no tempo de diagnóstico de falhas',
      maintenance: 'no tempo de manutenção preventiva',
    },
```

In `strings.en`, replace:

```ts
    hero: { viewProjects: 'View projects', contact: 'Contact' },
```

with:

```ts
    hero: {
      viewProjects: 'View projects',
      contact: 'Contact',
      tagline: 'I turn hard problems into fast, accessible, reliable interfaces.',
    },
    stats: {
      lighthouse: 'Lighthouse score',
      years: 'years in IT & support',
      diagnosis: 'in fault-diagnosis time',
      maintenance: 'in preventive maintenance time',
    },
```

- [ ] **Step 5: Create the stats data**

Create `src/data/stats.ts`:

```ts
import type { Strings } from '../i18n/strings'

export interface Stat {
  value: number
  prefix?: string
  suffix?: string
  labelKey: keyof Strings['stats']
}

/** Métricas curadas e verificáveis exibidas no fim da seção "Sobre". */
export const STATS: Stat[] = [
  { value: 100, labelKey: 'lighthouse' },
  { value: 5, prefix: '+', labelKey: 'years' },
  { value: 15, prefix: '−', suffix: '%', labelKey: 'diagnosis' },
  { value: 20, prefix: '−', suffix: '%', labelKey: 'maintenance' },
]
```

Note: `−` is U+2212 (minus sign), not a hyphen. Copy it exactly.

- [ ] **Step 6: Run tests**

Run: `npm run test -- src/data/stats.test.ts && npm run typecheck`
Expected: PASS and typecheck clean (every `strings` consumer still satisfies the widened `Strings` type because both `pt` and `en` were updated).

- [ ] **Step 7: Lint + format + commit**

```bash
npx prettier --write src/i18n/strings.ts src/data/stats.ts src/data/stats.test.ts
npm run lint
git add src/i18n/strings.ts src/data/stats.ts src/data/stats.test.ts
git commit -m "feat: add hero tagline and stats strings/data"
```

---

### Task 8: Stats strip in the About section

**Files:**
- Modify: `src/sections/About.tsx`
- Modify: `src/sections/About.test.tsx`

**Interfaces:**
- Consumes: `STATS`, `Stat` from `src/data/stats.ts`; `useInView` from `src/hooks/useInView.ts`; `useCountUp` from `src/hooks/useCountUp.ts`; `useI18n` from `src/i18n/context.ts`.
- Produces: no exported API change. Renders a `<ul>` of 4 stat items after the About card, inside the existing `<Section id="sobre">`.

- [ ] **Step 1: Write the failing test**

Add to `src/sections/About.test.tsx` — new import at top and a new `describe`/`it` block:

```tsx
import { render, screen, fireEvent, act } from '@testing-library/react'
import { About } from './About'
import { getProfile } from '../data/profile'
import { strings } from '../i18n/strings'
import { fireIntersection } from '../test/intersection'
```

```tsx
  it('mostra a faixa de números ao entrar na viewport', () => {
    document.documentElement.classList.add('a11y-reduce-motion')
    render(<About />)

    act(() => {
      fireIntersection(true)
    })

    expect(screen.getByText(strings.pt.stats.lighthouse)).toBeInTheDocument()
    expect(screen.getByText(strings.pt.stats.years)).toBeInTheDocument()
    expect(screen.getByText(strings.pt.stats.diagnosis)).toBeInTheDocument()
    expect(screen.getByText(strings.pt.stats.maintenance)).toBeInTheDocument()

    expect(
      screen.getByText((_, node) => node?.textContent === '100'),
    ).toBeInTheDocument()
    expect(
      screen.getByText((_, node) => node?.textContent === '−15%'),
    ).toBeInTheDocument()
  })
```

(Keep the existing `About` tests as they are; only add the import line for `act`, `strings`, `fireIntersection` and the new `it`.)

- [ ] **Step 2: Run test to verify it fails**

Run: `npm run test -- src/sections/About.test.tsx`
Expected: FAIL — the stat label text is not in the document.

- [ ] **Step 3: Modify `About.tsx`**

Full new contents of `src/sections/About.tsx`:

```tsx
import { useState } from 'react'
import { useI18n } from '../i18n/context'
import { Section } from '../components/Section'
import { useInView } from '../hooks/useInView'
import { useCountUp } from '../hooks/useCountUp'
import { STATS, type Stat } from '../data/stats'

function StatItem({ stat, active }: { stat: Stat; active: boolean }) {
  const { s } = useI18n()
  const count = useCountUp(stat.value, active)
  return (
    <li className="text-center">
      <p className="text-3xl font-bold tabular-nums text-neutral-900 dark:text-neutral-100">
        {stat.prefix}
        {count}
        {stat.suffix}
      </p>
      <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
        {s.stats[stat.labelKey]}
      </p>
    </li>
  )
}

/** Seção "Sobre mim": card com os parágrafos iniciais e uma faixa de números. */
export function About() {
  const { s, profile } = useI18n()
  const [expanded, setExpanded] = useState(false)
  const { ref: statsRef, inView: statsInView } = useInView<HTMLUListElement>()

  const paragraphs = profile.about
  const hasCollapsible = paragraphs.length > 1
  const alwaysVisible = hasCollapsible ? paragraphs.slice(0, -1) : paragraphs
  const collapsible = hasCollapsible
    ? paragraphs[paragraphs.length - 1]
    : undefined
  const extraId = 'sobre-extra'

  const paragraphClass =
    'text-lg leading-relaxed text-neutral-700 dark:text-neutral-300'

  return (
    <Section id="sobre" title={s.sections.about}>
      <div className="rounded-xl border border-neutral-200 p-6 dark:border-neutral-800">
        <div className="space-y-4">
          {alwaysVisible.map((paragraph, index) => (
            <p key={index} className={paragraphClass}>
              {paragraph}
            </p>
          ))}
          {expanded && collapsible && (
            <p id={extraId} className={paragraphClass}>
              {collapsible}
            </p>
          )}
        </div>

        {hasCollapsible && (
          <button
            type="button"
            onClick={() => setExpanded((value) => !value)}
            aria-expanded={expanded}
            aria-controls={extraId}
            className="mt-4 text-sm font-medium text-neutral-900 underline underline-offset-4 transition hover:no-underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-900 dark:text-neutral-100"
          >
            {expanded ? s.about.less : s.about.more}
          </button>
        )}
      </div>

      <ul
        ref={statsRef}
        className="mt-8 grid grid-cols-2 gap-6 sm:grid-cols-4"
      >
        {STATS.map((stat) => (
          <StatItem key={stat.labelKey} stat={stat} active={statsInView} />
        ))}
      </ul>
    </Section>
  )
}
```

- [ ] **Step 4: Run tests**

Run: `npm run test -- src/sections/About.test.tsx`
Expected: PASS (existing About tests + the new stats test).

- [ ] **Step 5: Lint + format + commit**

```bash
npx prettier --write src/sections/About.tsx src/sections/About.test.tsx
npm run lint
git add src/sections/About.tsx src/sections/About.test.tsx
git commit -m "feat: add animated stats strip to About section"
```

---

### Task 9: Hero rework (tagline, button hierarchy, icons, entrance stagger)

**Files:**
- Modify: `src/sections/Hero.tsx`
- Create: `src/sections/Hero.test.tsx`

**Interfaces:**
- Consumes: `useI18n`, `ExternalLink`, `prefersReducedMotion` from `src/lib/prefersReducedMotion.ts`.
- Produces: no exported API change. Hero now renders `s.hero.tagline`, one primary button (`Ver projetos`), two outline buttons (`Currículo`, `Contato`), and one icon link per `profile.contacts` entry (GitHub / LinkedIn) with an accessible name from `contact.label`.

- [ ] **Step 1: Write the failing test**

Create `src/sections/Hero.test.tsx`:

```tsx
import { render, screen } from '@testing-library/react'
import { Hero } from './Hero'
import { strings } from '../i18n/strings'
import { getProfile } from '../data/profile'

const profile = getProfile('pt')

describe('Hero', () => {
  it('mostra nome, cargo e a linha de valor', () => {
    render(<Hero />)
    expect(
      screen.getByRole('heading', { name: profile.name }),
    ).toBeInTheDocument()
    expect(screen.getByText(profile.role)).toBeInTheDocument()
    expect(screen.getByText(strings.pt.hero.tagline)).toBeInTheDocument()
  })

  it('tem "Ver projetos" como link principal e Currículo/Contato como secundários', () => {
    render(<Hero />)
    expect(
      screen.getByRole('link', { name: strings.pt.hero.viewProjects }),
    ).toHaveAttribute('href', '#projetos')
    expect(
      screen.getByRole('link', { name: strings.pt.hero.contact }),
    ).toHaveAttribute('href', '#contato')
    expect(screen.getByRole('link', { name: strings.pt.cv })).toBeInTheDocument()
  })

  it('expõe LinkedIn e GitHub como links com nome acessível', () => {
    render(<Hero />)
    for (const contact of profile.contacts) {
      expect(
        screen.getByRole('link', { name: contact.label }),
      ).toHaveAttribute('href', contact.href)
    }
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm run test -- src/sections/Hero.test.tsx`
Expected: FAIL — `screen.getByText(strings.pt.hero.tagline)` throws (tagline not rendered).

- [ ] **Step 3: Rewrite `Hero.tsx`**

Full new contents of `src/sections/Hero.tsx`:

```tsx
import type { CSSProperties } from 'react'
import { useEffect, useState } from 'react'
import { useI18n } from '../i18n/context'
import { ExternalLink } from '../components/ExternalLink'
import { prefersReducedMotion } from '../lib/prefersReducedMotion'

const iconProps = {
  width: 18,
  height: 18,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 2,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
  'aria-hidden': true,
}

function GithubIcon() {
  return (
    <svg {...iconProps}>
      <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
    </svg>
  )
}

function LinkedinIcon() {
  return (
    <svg {...iconProps}>
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
      <rect x="2" y="9" width="4" height="12" />
      <circle cx="4" cy="4" r="2" />
    </svg>
  )
}

/** Seção de abertura: nome, cargo, linha de valor e chamadas para ação. */
export function Hero() {
  const { s, profile, lang } = useI18n()
  const [reduce] = useState(prefersReducedMotion)
  const [shown, setShown] = useState(reduce)

  useEffect(() => {
    if (reduce) return
    const id = requestAnimationFrame(() => setShown(true))
    return () => cancelAnimationFrame(id)
  }, [reduce])

  const item = (index: number) => {
    if (reduce) return { className: '', style: undefined as CSSProperties | undefined }
    return {
      className: `reveal${shown ? ' is-visible' : ''}`,
      style: { transitionDelay: `${index * 60}ms` } as CSSProperties,
    }
  }

  const primary =
    'rounded-lg bg-neutral-900 px-5 py-2.5 font-medium text-white transition-colors hover:bg-neutral-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-900 dark:bg-neutral-100 dark:text-neutral-900 dark:hover:bg-neutral-300'
  const secondary =
    'rounded-lg border border-neutral-300 px-5 py-2.5 font-medium text-neutral-800 transition-colors hover:bg-neutral-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-900 dark:border-neutral-700 dark:text-neutral-200 dark:hover:bg-neutral-900'
  const icon =
    'flex h-11 w-11 items-center justify-center rounded-lg border border-neutral-300 text-neutral-700 transition-colors hover:bg-neutral-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-900 dark:border-neutral-700 dark:text-neutral-300 dark:hover:bg-neutral-900'

  return (
    <section
      id="inicio"
      className="mx-auto flex min-h-[70svh] w-full max-w-3xl flex-col items-center justify-center px-6 py-20 text-center"
    >
      <h1
        {...item(0)}
        className={`text-4xl font-bold tracking-tight text-neutral-900 sm:text-6xl dark:text-neutral-50 ${item(0).className}`}
      >
        {profile.name}
      </h1>
      <p
        {...item(1)}
        className={`mt-4 text-xl text-neutral-700 sm:text-2xl dark:text-neutral-300 ${item(1).className}`}
      >
        {profile.role}
      </p>
      <p
        {...item(2)}
        className={`mt-3 max-w-xl text-base text-neutral-600 dark:text-neutral-400 ${item(2).className}`}
      >
        {s.hero.tagline}
      </p>
      <p
        {...item(3)}
        className={`mt-2 text-sm text-neutral-500 dark:text-neutral-400 ${item(3).className}`}
      >
        {profile.location}
      </p>

      <nav
        {...item(4)}
        aria-label={s.hero.viewProjects}
        className={`mt-8 flex flex-wrap items-center justify-center gap-3 ${item(4).className}`}
      >
        <a href="#projetos" className={primary}>
          {s.hero.viewProjects}
        </a>
        <a href={`/cv.html?lang=${lang}`} target="_blank" rel="noopener" className={secondary}>
          {s.cv}
        </a>
        <a href="#contato" className={secondary}>
          {s.hero.contact}
        </a>
        {profile.contacts.map((contact) => (
          <ExternalLink key={contact.type} href={contact.href} className={icon}>
            {contact.type === 'github' ? <GithubIcon /> : <LinkedinIcon />}
            <span className="sr-only">{contact.label}</span>
          </ExternalLink>
        ))}
      </nav>
    </section>
  )
}
```

Note on `{...item(n)}` spread: it applies `style` (and an empty `className` that is immediately overridden by the explicit `className={...}` prop that follows — in JSX the last `className` wins). The explicit `className` template includes `item(n).className` so the reveal classes are present. This keeps `style` (transition delay) and `className` (reveal state) together per element.

- [ ] **Step 4: Run test to verify it passes**

Run: `npm run test -- src/sections/Hero.test.tsx`
Expected: PASS (all three cases). In jsdom `matchMedia` is mocked to `matches: false` and there is no `a11y-reduce-motion` class, so `reduce` is `false`; text is still queryable regardless of the `reveal` opacity.

- [ ] **Step 5: Lint + format + commit**

```bash
npx prettier --write src/sections/Hero.tsx src/sections/Hero.test.tsx
npm run lint
git add src/sections/Hero.tsx src/sections/Hero.test.tsx
git commit -m "feat: rework Hero with tagline, button hierarchy and entrance stagger"
```

---

### Task 10: Animated underline on content links

**Files:**
- Modify: `src/sections/Contact.tsx`
- Modify: `src/sections/Projects.tsx`

**Interfaces:**
- Consumes: `.link-underline` class from `src/index.css` (Task 5).
- Produces: no API change. Adds `link-underline` to the anchor links in Contact and Projects (not to buttons, not to the arrow controls).

- [ ] **Step 1: Add a regression test for Contact**

Create `src/sections/Contact.test.tsx`:

```tsx
import { render, screen } from '@testing-library/react'
import { Contact } from './Contact'
import { strings } from '../i18n/strings'

describe('Contact', () => {
  it('aplica o sublinhado animado nos links (não nos botões)', () => {
    render(<Contact />)
    expect(screen.getByRole('link', { name: strings.pt.cv })).toHaveClass(
      'link-underline',
    )
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm run test -- src/sections/Contact.test.tsx`
Expected: FAIL — the CV link does not have class `link-underline`.

- [ ] **Step 3: Add the class in `Contact.tsx`**

In `src/sections/Contact.tsx`, the CV `<a>` `className` currently starts with `'inline-flex rounded-lg border ...'`. Change both the CV `<a>` and the `ExternalLink` `className` strings so they begin with `link-underline `:

- CV link: `className="link-underline inline-flex rounded-lg border border-neutral-300 px-5 py-2.5 font-medium text-neutral-800 transition-colors hover:bg-neutral-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-900 dark:border-neutral-700 dark:text-neutral-200 dark:hover:bg-neutral-900"`
- `ExternalLink` in the `.map`: `className="link-underline inline-flex rounded-lg border border-neutral-300 px-5 py-2.5 font-medium text-neutral-800 transition-colors hover:bg-neutral-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-900 dark:border-neutral-700 dark:text-neutral-200 dark:hover:bg-neutral-900"`

- [ ] **Step 4: Add the class in `Projects.tsx`**

In `src/sections/Projects.tsx`, the three link/button elements inside the card footer share the class `'text-neutral-900 underline underline-offset-4 hover:no-underline dark:text-neutral-100'`. For the two `ExternalLink` elements (repo and live) only — **not** the case-study `<button>` — prepend `link-underline ` and drop the static `underline`:

- repo `ExternalLink`: `className="link-underline text-neutral-900 underline-offset-4 dark:text-neutral-100"`
- live `ExternalLink`: `className="link-underline text-neutral-900 underline-offset-4 dark:text-neutral-100"`

Leave the `<button>` (`s.caseStudy.hide`/`show`) exactly as it is.

- [ ] **Step 5: Run tests**

Run: `npm run test -- src/sections/Contact.test.tsx src/sections/Projects.test.tsx`
Expected: PASS — new Contact test passes; existing Projects tests still pass.

- [ ] **Step 6: Lint + format + commit**

```bash
npx prettier --write src/sections/Contact.tsx src/sections/Contact.test.tsx src/sections/Projects.tsx
npm run lint
git add src/sections/Contact.tsx src/sections/Contact.test.tsx src/sections/Projects.tsx
git commit -m "feat: animated underline on contact and project links"
```

---

### Task 11: Scroll-spy on the header nav

**Files:**
- Modify: `src/App.tsx`
- Modify: `src/App.test.tsx`

**Interfaces:**
- Consumes: `useScrollSpy` from `src/hooks/useScrollSpy.ts`.
- Produces: no API change. The header nav link matching the active section gets `aria-current="true"` and classes `is-active text-neutral-900 dark:text-neutral-100`; every nav link gets `link-underline`.

- [ ] **Step 1: Write the failing test**

Full new contents of `src/App.test.tsx`:

```tsx
import { render, screen, act } from '@testing-library/react'
import App from './App'
import { fireIntersection } from './test/intersection'

describe('App', () => {
  it('renderiza o nome do desenvolvedor', () => {
    render(<App />)
    expect(
      screen.getByRole('heading', { name: /carlos eduardo/i }),
    ).toBeInTheDocument()
  })

  it('marca o link da nav da seção ativa com aria-current', () => {
    const { container } = render(<App />)
    const sobre = document.getElementById('sobre')
    expect(sobre).not.toBeNull()

    act(() => {
      fireIntersection([{ target: sobre as Element, isIntersecting: true }])
    })

    const link = container.querySelector('a[href="#sobre"]')
    expect(link).toHaveAttribute('aria-current', 'true')
    expect(link).toHaveClass('is-active')
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm run test -- src/App.test.tsx`
Expected: FAIL — the `#sobre` nav link has no `aria-current`.

- [ ] **Step 3: Modify `App.tsx`**

Add the import near the other imports:

```tsx
import { useScrollSpy } from './hooks/useScrollSpy'
```

Add a module-level constant above `function App()`:

```tsx
const SECTION_IDS: readonly string[] = [
  'jogo',
  'sobre',
  'experiencia',
  'competencias',
  'projetos',
  'pergunte',
  'contato',
]
```

Inside `function App()`, after `const { s, profile } = useI18n()`:

```tsx
  const activeId = useScrollSpy(SECTION_IDS)
```

Replace the nav `<ul>` `.map` block:

```tsx
              {navLinks.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="text-neutral-600 transition-colors hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
```

with:

```tsx
              {navLinks.map((link) => {
                const isActive = activeId === link.href.slice(1)
                return (
                  <li key={link.href}>
                    <a
                      href={link.href}
                      aria-current={isActive ? 'true' : undefined}
                      className={`link-underline transition-colors ${
                        isActive
                          ? 'is-active text-neutral-900 dark:text-neutral-100'
                          : 'text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100'
                      }`}
                    >
                      {link.label}
                    </a>
                  </li>
                )
              })}
```

- [ ] **Step 4: Run tests**

Run: `npm run test -- src/App.test.tsx`
Expected: PASS (both cases).

- [ ] **Step 5: Lint + format + commit**

```bash
npx prettier --write src/App.tsx src/App.test.tsx
npm run lint
git add src/App.tsx src/App.test.tsx
git commit -m "feat: scroll-spy the header nav with aria-current"
```

---

### Task 12: Finalize — full gate, visual check, version, changelog, tag

**Files:**
- Modify: `package.json` (version)
- Modify: `CHANGELOG.md`

**Interfaces:**
- Consumes: everything above.
- Produces: a tagged `v1.10.0`.

- [ ] **Step 1: Full quality gate**

Run each and confirm green:

```bash
npm run lint
npm run typecheck
npm run test
npm run build
```

Expected: no errors; `test` reports all suites passing (existing + the new `useInView`, `useCountUp`, `useScrollSpy`, `Reveal`, `Section`, `Contact`, `Hero`, `intersection`, plus updated `About`, `App`); `build` writes `dist/` with no TypeScript errors.

- [ ] **Step 2: Visual check in the browser**

Start the dev server and drive it with the Playwright MCP (Opera GX, profile "Teste com claude", port 9222):

```bash
npm run dev
```

Then, via the browser tool: open `http://localhost:5173/`, and verify:
1. Hero: name → role → tagline → location → buttons fade/slide in staggered on load. One filled "Ver projetos", outline "Currículo"/"Contato", two icon buttons.
2. Scroll down: About card, then the 4-number strip counts up from 0 once it enters view (100, +5, −15%, −20%).
3. Each section fades/slides in as it enters the viewport; the mini-game appears immediately (no reveal).
4. Header nav: the link for the section in view is highlighted (`aria-current`) with a full underline; other nav links grow an underline on hover.
5. Toggle the a11y widget "Reduzir animações" (and/or set OS reduce-motion): reload — everything is visible immediately, numbers show final values, no fades, no layout shift.
6. Toggle dark/light and PT/EN: tagline and stat labels switch language; contrast is fine in both themes.

Take screenshots (`.playwright-mcp/` is gitignored) for the summary. Stop the dev server when done.

- [ ] **Step 3: Bump the version**

In `package.json` change `"version": "1.9.1"` to `"version": "1.10.0"`.

- [ ] **Step 4: Update the changelog**

In `CHANGELOG.md`, insert directly below the `e o projeto segue [Versionamento Semântico]...` intro line and above `## [1.9.1] - 2026-07-13`:

```markdown
## [1.10.0] - 2026-09-09

### Adicionado

- Movimento sóbrio no site, tudo em CSS + hooks próprios (sem biblioteca): as
  seções surgem com fade e leve deslize ao entrar na tela, o Hero tem uma entrada
  encadeada e os links ganham um sublinhado animado.
- Faixa de números na seção "Sobre" (100 no Lighthouse, mais de 5 anos em TI,
  redução de 15% no diagnóstico de falhas, redução de 20% na manutenção
  preventiva), com contagem animada quando entra na tela.
- Linha de valor no Hero e hierarquia de botões (uma ação principal "Ver
  projetos", "Currículo" e "Contato" secundários, LinkedIn e GitHub como ícones).
- Navegação com destaque da seção ativa (scroll-spy) no cabeçalho.

### Acessibilidade

- Todo o movimento é desligado quando o usuário pede menos animação (preferência
  do sistema ou botão "Reduzir animações"): o conteúdo aparece direto, sem
  deslocamento de layout.
```

- [ ] **Step 5: Commit and tag**

```bash
npx prettier --write package.json CHANGELOG.md
npm run lint
git add package.json CHANGELOG.md
git commit -m "chore(release): v1.10.0"
git tag v1.10.0
```

- [ ] **Step 6: Report**

Summarize what shipped, paste the key screenshots, and note the branch state (commits ready on `feat/v1.10-movimento`, tag `v1.10.0`) so the user can merge/push on their terms.

---

## Self-Review

**1. Spec coverage:**
- Spec 2.1 `useInView` → Task 2. (Refined: hook takes no args, defaults hardcoded — noted in Task 2 interface.)
- Spec 2.2 `useCountUp` → Task 3 (signature `(target, start, opts?)` matches the corrected spec).
- Spec 2.3 `useScrollSpy` → Task 4 (order-of-`ids` tie-break, matches corrected spec).
- Spec 2.4 `Reveal` → Task 5 (renders a `<div>`, `as` prop dropped as noted).
- Spec 2.5 CSS (`.reveal`, `.link-underline`, `.is-active`, `scroll-behavior`, reduced-motion fallbacks) → Task 5.
- Spec 3.1 Hero (tagline, hierarchy, icons, stagger) → Task 9.
- Spec 3.2 stats strip in About → Tasks 7 (data/strings) + 8 (UI).
- Spec 3.3 Section reveal, Game excluded → Task 6 (Game section is not a `<Section>` consumer and is untouched).
- Spec 3.4 scroll-spy in App, underline on nav/contact/project links → Tasks 11 (nav) + 10 (contact/projects).
- Spec 4 test infra (IO + matchMedia mocks, new test files) → Task 1 + per-task tests.
- Spec 6 version/changelog/tag → Task 12.
- Spec 5 non-goals: no library (none added), no mobile menu (nav markup untouched except classes), no Experience data change (stats strip used instead), game/Ask/CV untouched. Honored.

**2. Placeholder scan:** No TBD/TODO/"handle edge cases"/"similar to Task N". Every code step shows complete code; every command has expected output.

**3. Type consistency:**
- `useInView` returns `{ ref, inView }` — consumed by `Reveal` (Task 5) and `About` (Task 8) with that exact shape.
- `useCountUp(target, start, opts?)` — called in `About` `StatItem` as `useCountUp(stat.value, active)` (Task 8) and tested with the 3-arg form (Task 3). Consistent.
- `useScrollSpy(ids: readonly string[])` — `App` passes `SECTION_IDS: readonly string[]` (Task 11); test passes `['first','second']` literal (Task 4). Consistent.
- `Stat` / `STATS` shape defined in Task 7, consumed in Task 8 (`stat.value`, `stat.prefix`, `stat.suffix`, `stat.labelKey`) and Task 7 test. Consistent.
- `prefersReducedMotion()` defined in Task 3, consumed in Task 9 (`Hero`). Consistent.
- `fireIntersection` / `resetIntersection` / `MockIntersectionObserver` defined in Task 1, consumed in Tasks 2, 4, 5, 6, 8, 11 tests. Consistent.
- i18n keys `hero.tagline`, `stats.{lighthouse,years,diagnosis,maintenance}` added in Task 7, read in Tasks 8, 9. Consistent.

No issues found.
