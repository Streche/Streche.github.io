import { render, screen } from '@testing-library/react'
import { Contact } from './Contact'
import { strings } from '../i18n/strings'

describe('Contact', () => {
  it('aplica o sublinhado animado nos links (não nos botões)', () => {
    render(<Contact />)
    expect(screen.getByRole('link', { name: strings.pt.cv })).toHaveClass(
      'link-underline',
    )
  })
})
