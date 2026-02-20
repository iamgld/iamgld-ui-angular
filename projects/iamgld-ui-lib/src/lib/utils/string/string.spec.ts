import { capitalizeFirstLetter } from './string'

describe('capitalizeFirstLetter', () => {
  it('Given test context, When executing, Then validates expected behavior', () => {
    // Given
    const input = 'hELLO'

    // When
    const result = capitalizeFirstLetter(input)

    // Then
    expect(result).toBe('Hello')
  })

  it('Given test context, When executing, Then validates expected behavior', () => {
    // Given
    const emptyString = ''
    const undefinedValue = undefined as unknown as string
    const nullValue = null as unknown as string

    // When
    const resultEmpty = capitalizeFirstLetter(emptyString)
    const resultUndefined = capitalizeFirstLetter(undefinedValue)
    const resultNull = capitalizeFirstLetter(nullValue)

    // Then
    expect(resultEmpty).toBe('')
    expect(resultUndefined).toBeUndefined()
    expect(resultNull).toBeNull()
  })
})
