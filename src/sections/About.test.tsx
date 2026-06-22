import { render, screen } from '@testing-library/react'
import { About } from './About'
import { profile } from '../data/profile'

describe('About', () => {
  it('renderiza o título da seção', () => {
    render(<About />)
    expect(
      screen.getByRole('heading', { name: /sobre mim/i }),
    ).toBeInTheDocument()
  })

  it('renderiza todos os parágrafos do "sobre"', () => {
    render(<About />)
    for (const paragraph of profile.about) {
      expect(screen.getByText(paragraph)).toBeInTheDocument()
    }
  })
})
