import { render, screen } from '@testing-library/react'
import { WhatIDo } from './WhatIDo'
import { getProfile } from '../data/profile'

const profile = getProfile('pt')

describe('WhatIDo', () => {
  it('renderiza o título da seção e os 4 itens com número, título e descrição', () => {
    render(<WhatIDo />)
    expect(
      screen.getByRole('heading', { name: /o que eu faço/i }),
    ).toBeInTheDocument()

    profile.whatIDo.forEach((item, index) => {
      expect(
        screen.getByText(String(index + 1).padStart(2, '0')),
      ).toBeInTheDocument()
      expect(screen.getByText(item.title)).toBeInTheDocument()
      expect(screen.getByText(item.description)).toBeInTheDocument()
    })
  })
})
