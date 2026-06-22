import { render, screen } from '@testing-library/react'
import { Skills } from './Skills'
import { getProfile } from '../data/profile'

const profile = getProfile('pt')

describe('Skills', () => {
  it('renderiza o título da seção', () => {
    render(<Skills />)
    expect(
      screen.getByRole('heading', { name: /competências/i }),
    ).toBeInTheDocument()
  })

  it('renderiza todos os grupos e itens de competência', () => {
    render(<Skills />)
    for (const group of profile.skills) {
      expect(screen.getByText(group.label)).toBeInTheDocument()
      for (const item of group.items) {
        expect(screen.getByText(item)).toBeInTheDocument()
      }
    }
  })
})
