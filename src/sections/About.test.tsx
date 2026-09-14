import { render, screen, fireEvent, act } from '@testing-library/react'
import { About } from './About'
import { getProfile } from '../data/profile'
import { strings } from '../i18n/strings'
import { fireIntersection } from '../test/intersection'

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
      screen.getByText((_, node) => node?.textContent === '99'),
    ).toBeInTheDocument()
    expect(
      screen.getByText((_, node) => node?.textContent === '−15%'),
    ).toBeInTheDocument()
  })
})
