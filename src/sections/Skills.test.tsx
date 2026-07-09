import { render, screen } from '@testing-library/react'
import { Skills, MAX_VISIBLE_SKILLS } from './Skills'
import { getProfile } from '../data/profile'

const profile = getProfile('pt')

describe('Skills', () => {
  it('renderiza o título da seção', () => {
    render(<Skills />)
    expect(
      screen.getByRole('heading', { name: /competências/i }),
    ).toBeInTheDocument()
  })

  it('renderiza cada grupo com as competências principais visíveis', () => {
    render(<Skills />)
    for (const group of profile.skills) {
      expect(screen.getByText(group.label)).toBeInTheDocument()
      for (const item of group.items.slice(0, MAX_VISIBLE_SKILLS)) {
        expect(screen.getByText(item)).toBeInTheDocument()
      }
    }
  })

  it('não exibe competências além das principais', () => {
    render(<Skills />)
    for (const group of profile.skills) {
      for (const item of group.items.slice(MAX_VISIBLE_SKILLS)) {
        expect(screen.queryByText(item)).not.toBeInTheDocument()
      }
    }
  })
})
