import { render, screen, act } from '@testing-library/react'
import { Reveal } from './Reveal'
import { fireIntersection } from '../test/intersection'

describe('Reveal', () => {
  it('renderiza os filhos e ganha is-visible ao entrar na viewport', () => {
    render(
      <Reveal className="extra">
        <p>conteúdo revelável</p>
      </Reveal>,
    )
    const text = screen.getByText('conteúdo revelável')
    const wrapper = text.parentElement as HTMLElement

    expect(wrapper).toHaveClass('reveal', 'extra')
    expect(wrapper).not.toHaveClass('is-visible')

    act(() => {
      fireIntersection(true)
    })
    expect(wrapper).toHaveClass('is-visible')
  })
})
