import { updateValueWithMask } from './control'

describe('updateValueWithMask', () => {
  it('applies mask placeholders', () => {
    expect(updateValueWithMask({ mask: '00-00', value: '1234' })).toBe('12-34')
  })

  it('keeps characters when they already match placeholder', () => {
    expect(updateValueWithMask({ mask: '00-00', value: '12-34' })).toBe('12-34')
  })

  it('returns original value for empty-like values', () => {
    expect(updateValueWithMask({ mask: '00-00', value: '' })).toBe('')
    expect(updateValueWithMask({ mask: '00-00', value: undefined as unknown as string })).toBe(
      undefined,
    )
  })
})
