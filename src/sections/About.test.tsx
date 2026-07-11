import { render, screen, fireEvent } from '@testing-library/react'
import { About } from './About'
import { getProfile } from '../data/profile'

const profile = getProfile('pt')
const paragraphs = profile.about
const lastParagraph = paragraphs[paragraphs.length - 1]

describe('About', () => {
  it('renderiza o título da seção', () => {
    render(<About />)
    expect(
      screen.getByRole('heading', { name: /sobre mim/i }),
    ).toBeInTheDocument()
  })

  it('mostra os parágrafos iniciais do "sobre"', () => {
    render(<About />)
    for (const paragraph of paragraphs.slice(0, -1)) {
      expect(screen.getByText(paragraph)).toBeInTheDocument()
    }
  })

  it('mantém o último parágrafo oculto até "Ver mais"', () => {
    render(<About />)
    expect(lastParagraph).toBeDefined()
    if (lastParagraph === undefined) return
    expect(screen.queryByText(lastParagraph)).not.toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: /ver mais/i }))
    expect(screen.getByText(lastParagraph)).toBeInTheDocument()
  })
})
