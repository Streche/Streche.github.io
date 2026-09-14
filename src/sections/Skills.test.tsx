import { render, screen } from '@testing-library/react'
import { Skills } from './Skills'
import { getProfile } from '../data/profile'

const profile = getProfile('pt')
const allItems = profile.skills.flatMap((group) => group.items)

describe('Skills', () => {
  it('renderiza o título da seção', () => {
    render(<Skills />)
    expect(
      screen.getByRole('heading', { name: /competências/i }),
    ).toBeInTheDocument()
  })

  it('mostra cada competência ao menos uma vez, em grade estática com reduced-motion', () => {
    document.documentElement.classList.add('a11y-reduce-motion')
    render(<Skills />)
    for (const item of allItems) {
      expect(screen.getAllByText(item).length).toBeGreaterThanOrEqual(1)
    }
  })
})
