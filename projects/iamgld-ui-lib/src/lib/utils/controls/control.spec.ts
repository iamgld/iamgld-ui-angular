import { updateValueWithMask } from './control'

describe('updateValueWithMask', () => {
  it('Given test context, When executing, Then validates expected behavior', () => {
    expect(updateValueWithMask({ mask: '00-00', value: '1234' })).toBe('12-34')
  })

  it('Given test context, When executing, Then validates expected behavior', () => {
    expect(updateValueWithMask({ mask: '00-00', value: '12-34' })).toBe('12-34')
  })

  it('Given test context, When executing, Then validates expected behavior', () => {
    expect(updateValueWithMask({ mask: '00-00', value: '' })).toBe('')
    expect(updateValueWithMask({ mask: '00-00', value: undefined as unknown as string })).toBe(
      undefined,
    )
  })
})
