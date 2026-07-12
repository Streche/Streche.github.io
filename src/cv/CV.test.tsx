import { render, screen } from '@testing-library/react'
import { CV } from './CV'
import { getCv } from '../data/cv'

const cv = getCv('pt')

describe('CV', () => {
  it('renderiza o nome e o e-mail', () => {
    render(<CV lang="pt" />)
    expect(
      screen.getByRole('heading', { name: cv.fullName, level: 1 }),
    ).toBeInTheDocument()
    expect(
      screen.getByText(/carlos\.eduardodms1@gmail\.com/i),
    ).toBeInTheDocument()
  })

  it('renderiza os cargos e as formações', () => {
    render(<CV lang="pt" />)
    for (const item of cv.experience) {
      expect(screen.getByText(item.role)).toBeInTheDocument()
    }
    for (const item of cv.education) {
      expect(screen.getByText(item.course)).toBeInTheDocument()
    }
  })
})
