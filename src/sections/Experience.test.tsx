import { render, screen } from '@testing-library/react'
import { Experience } from './Experience'
import { getProfile } from '../data/profile'

const profile = getProfile('pt')

describe('Experience', () => {
  it('renderiza o título da seção', () => {
    render(<Experience />)
    expect(
      screen.getByRole('heading', { name: 'Experiência', level: 2 }),
    ).toBeInTheDocument()
  })

  it('renderiza os cargos e as formações', () => {
    render(<Experience />)
    for (const item of profile.experience) {
      expect(screen.getByText(item.role)).toBeInTheDocument()
    }
    for (const item of profile.education) {
      expect(screen.getByText(item.course)).toBeInTheDocument()
    }
  })
})
