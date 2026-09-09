import { render, screen } from '@testing-library/react'
import { Hero } from './Hero'
import { strings } from '../i18n/strings'
import { getProfile } from '../data/profile'

const profile = getProfile('pt')

describe('Hero', () => {
  it('mostra nome, cargo e a linha de valor', () => {
    render(<Hero />)
    expect(
      screen.getByRole('heading', { name: profile.name }),
    ).toBeInTheDocument()
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
