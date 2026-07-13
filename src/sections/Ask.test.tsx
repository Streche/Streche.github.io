import { render, screen, fireEvent } from '@testing-library/react'
import { Ask } from './Ask'
import { getFaq } from '../data/faq'

const faq = getFaq('pt')

describe('Ask', () => {
  it('mostra a resposta ao clicar numa pergunta', () => {
    render(<Ask />)
    const first = faq[0]
    expect(first).toBeDefined()
    if (!first) return

    expect(screen.queryByText(first.answer)).not.toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: first.question }))

    expect(screen.getByText(first.answer)).toBeInTheDocument()
  })
})
