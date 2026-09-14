import { render, screen } from '@testing-library/react'
import { Hero } from './Hero'
import { strings } from '../i18n/strings'
import { getProfile } from '../data/profile'

const profile = getProfile('pt')

const displayName = profile.name.split(' ').at(-1)

describe('Hero', () => {
  it('mostra o último nome em destaque, o primeiro nome, cargo e a linha de valor', () => {
    render(<Hero />)
    expect(displayName).toBeDefined()
    expect(
      screen.getByRole('heading', { name: displayName }),
    ).toBeInTheDocument()
    expect(screen.getByText('Carlos')).toBeInTheDocument()
    expect(screen.getByText(profile.role)).toBeInTheDocument()
    expect(screen.getByText(strings.pt.hero.tagline)).toBeInTheDocument()
  })

  it('tem "Ver projetos" como link principal e Currículo/Contato como secundários', () => {
    render(<Hero />)
    expect(
      screen.getByRole('link', { name: strings.pt.hero.viewProjects }),
    ).toHaveAttribute('href', '#projetos')
    expect(
      screen.getByRole('link', { name: strings.pt.hero.contact }),
    ).toHaveAttribute('href', '#contato')
    expect(
      screen.getByRole('link', { name: strings.pt.cv }),
    ).toBeInTheDocument()
  })

  it('expõe LinkedIn e GitHub como links com nome acessível', () => {
    render(<Hero />)
    for (const contact of profile.contacts) {
      expect(screen.getByRole('link', { name: contact.label })).toHaveAttribute(
        'href',
        contact.href,
      )
    }
  })
})
