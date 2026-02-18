import { capitalizeFirstLetter } from './string'

describe('capitalizeFirstLetter', () => {
  it('capitalizes first character and lowercases rest', () => {
    expect(capitalizeFirstLetter('hELLO')).toBe('Hello')
  })

  it('returns same value for empty-like inputs', () => {
    expect(capitalizeFirstLetter('')).toBe('')
    expect(capitalizeFirstLetter(undefined as unknown as string)).toBeUndefined()
    expect(capitalizeFirstLetter(null as unknown as string)).toBeNull()
  })
})
