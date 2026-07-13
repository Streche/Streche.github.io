import { render, screen, fireEvent } from '@testing-library/react'
import { Projects } from './Projects'
import { getProfile } from '../data/profile'

const profile = getProfile('pt')

describe('Projects', () => {
  it('mantém o estudo de caso oculto até "Ver estudo de caso"', () => {
    render(<Projects />)
    const project = profile.projects.find((p) => p.caseStudy)
    expect(project?.caseStudy).toBeDefined()
    if (!project?.caseStudy) return

    expect(
      screen.queryByText(project.caseStudy.problem),
    ).not.toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: /ver estudo de caso/i }))

    expect(screen.getByText(project.caseStudy.problem)).toBeInTheDocument()
  })
})
