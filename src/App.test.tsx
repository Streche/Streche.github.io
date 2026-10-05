import { render, screen, act } from '@testing-library/react'
import App from './App'
import { fireIntersection } from './test/intersection'

describe('App', () => {
  it('renderiza o nome do desenvolvedor no cabeçalho e no Hero', () => {
    render(<App />)
    expect(
      screen.getByRole('link', { name: /carlos eduardo/i }),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('heading', { name: /eduardo/i }),
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
