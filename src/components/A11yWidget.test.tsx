import { render, screen, fireEvent } from '@testing-library/react'
import { A11yWidget } from './A11yWidget'

describe('A11yWidget', () => {
  afterEach(() => {
    document.documentElement.className = ''
    document.documentElement.style.fontSize = ''
  })

  it('abre o painel e aplica o alto contraste', () => {
    render(<A11yWidget />)
    fireEvent.click(screen.getByRole('button', { name: /acessibilidade/i }))
    fireEvent.click(screen.getByRole('button', { name: /alto contraste/i }))
    expect(document.documentElement.classList.contains('a11y-contrast')).toBe(
      true,
    )
  })

  it('aumenta o tamanho da fonte', () => {
    render(<A11yWidget />)
    fireEvent.click(screen.getByRole('button', { name: /acessibilidade/i }))
    fireEvent.click(screen.getByRole('button', { name: /aumentar fonte/i }))
    expect(document.documentElement.style.fontSize).not.toBe('')
  })
})
