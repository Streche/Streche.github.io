import { render, screen, act } from '@testing-library/react'
import { useMagnetic } from './useMagnetic'

function mockRect(el: HTMLElement) {
  el.getBoundingClientRect = () =>
    ({
      left: 100,
      top: 100,
      width: 40,
      height: 40,
      right: 140,
      bottom: 140,
      x: 100,
      y: 100,
      toJSON() {},
    }) as DOMRect
}

function TestButton() {
  const ref = useMagnetic<HTMLButtonElement>()
  return <button ref={ref}>alvo</button>
}

function moveTo(x: number, y: number) {
  act(() => {
    window.dispatchEvent(
      new MouseEvent('mousemove', { clientX: x, clientY: y }),
    )
  })
}

describe('useMagnetic', () => {
  it('aproxima o elemento do cursor quando perto e volta a 0 quando longe', () => {
    render(<TestButton />)
    const el = screen.getByRole('button', { name: 'alvo' })
    mockRect(el)

    moveTo(130, 120) // dx=10, dy=0, dentro do padding
    expect(el.style.transform).toBe('translate(3.3333333333333335px, 0px)')

    moveTo(1000, 1000) // bem longe
    expect(el.style.transform).toBe('translate(0, 0)')
  })

  it('não mexe no elemento quando o usuário pediu menos animação', () => {
    document.documentElement.classList.add('a11y-reduce-motion')
    render(<TestButton />)
    const el = screen.getByRole('button', { name: 'alvo' })
    mockRect(el)

    moveTo(130, 120)
    expect(el.style.transform).toBe('')
  })
})
