import { render, screen, fireEvent } from '@testing-library/react'
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

  it('mantém as competências extras ocultas até "Ver mais"', () => {
    render(<Skills />)
    for (const group of profile.skills) {
      for (const item of group.items.slice(MAX_VISIBLE_SKILLS)) {
        expect(screen.queryByText(item)).not.toBeInTheDocument()
      }
    }
  })

  it('expande as competências extras ao clicar em "Ver mais"', () => {
    render(<Skills />)
    const frontend = profile.skills[0]
    const extraItem = frontend?.items[MAX_VISIBLE_SKILLS]
    expect(extraItem).toBeDefined()
    if (extraItem === undefined) return
    expect(screen.queryByText(extraItem)).not.toBeInTheDocument()

    const [firstButton] = screen.getAllByRole('button', { name: /ver mais/i })
    expect(firstButton).toBeDefined()
    if (firstButton === undefined) return
    fireEvent.click(firstButton)

    expect(screen.getByText(extraItem)).toBeInTheDocument()
  })
})
