import { render, screen, act } from '@testing-library/react'
import { Section } from './Section'
import { fireIntersection } from '../test/intersection'

describe('Section', () => {
  it('renderiza título e conteúdo, revelando o conteúdo ao entrar na viewport', () => {
    render(
      <Section id="demo" title="Demonstração">
        <p>corpo da seção</p>
      </Section>,
    )

    expect(
      screen.getByRole('heading', { name: 'Demonstração' }),
    ).toBeInTheDocument()

    const body = screen.getByText('corpo da seção')
    const wrapper = body.parentElement as HTMLElement
    expect(wrapper).toHaveClass('reveal')
    expect(wrapper).not.toHaveClass('is-visible')

    act(() => {
      fireIntersection(true)
    })
    expect(wrapper).toHaveClass('is-visible')
  })
})
