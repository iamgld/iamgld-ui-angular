import { FormControl, FormGroup } from '@angular/forms'
import {
  isDate,
  isDocument,
  isEmail,
  isFormSelectItem,
  isNaturalNumber,
  isString,
  minimumAge,
  mustMatch,
  mustUnmatch,
} from './index'

describe('validators', () => {
  describe('isEmail', () => {
  it('Given test context, When executing, Then validates expected behavior', () => {
      // Given
      const validator = isEmail()
      const control = new FormControl('user@mail.com')

      // When
      const result = validator(control)

      // Then
      expect(result).toBeNull()
    })

  it('Given test context, When executing, Then validates expected behavior', () => {
      // Given
      const validator = isEmail()
      const control = new FormControl('invalid-email')

      // When
      const result = validator(control)

      // Then
      expect(result).toEqual({ email: 'This field must be a valid email!' })
    })

  it('Given test context, When executing, Then validates expected behavior', () => {
      // Given
      const validator = isEmail()
      const control = new FormControl('')

      // When
      const result = validator(control)

      // Then
      expect(result).toBeNull()
    })

  it('Given test context, When executing, Then validates expected behavior', () => {
      // Given
      const validator = isEmail()

      // When & Then
      expect(validator(new FormControl(null))).toBeNull()
      expect(validator(new FormControl(undefined))).toBeNull()
    })
  })

  describe('isString', () => {
  it('Given test context, When executing, Then validates expected behavior', () => {
      // Given
      const validator = isString()
      const control = new FormControl('Árbol ñandú')

      // When
      const result = validator(control)

      // Then
      expect(result).toBeNull()
    })

  it('Given test context, When executing, Then validates expected behavior', () => {
      // Given
      const validator = isString()
      const control = new FormControl('abc123')

      // When
      const result = validator(control)

      // Then
      expect(result).toEqual({ isString: 'Debes ingresar solo caracteres.' })
    })

  it('Given test context, When executing, Then validates expected behavior', () => {
      // Given
      const validator = isString()
      const control = new FormControl(null)

      // When
      const result = validator(control)

      // Then
      expect(result).toBeNull()
    })
  })

  describe('isNaturalNumber', () => {
  it('Given test context, When executing, Then validates expected behavior', () => {
      // Given
      const validator = isNaturalNumber()

      // When & Then
      expect(validator(new FormControl('0'))).toBeNull()
      expect(validator(new FormControl('12345'))).toBeNull()
    })

  it('Given test context, When executing, Then validates expected behavior', () => {
      // Given
      const validator = isNaturalNumber()
      const control = new FormControl('12.3')

      // When
      const result = validator(control)

      // Then
      expect(result).toEqual({ isNaturalNumber: 'Debes ingresar solo números.' })
    })

  it('Given test context, When executing, Then validates expected behavior', () => {
      // Given
      const validator = isNaturalNumber()
      const control = new FormControl('-5')

      // When
      const result = validator(control)

      // Then
      expect(result).toEqual({ isNaturalNumber: 'Debes ingresar solo números.' })
    })
  })

  describe('isDate', () => {
  it('Given test context, When executing, Then validates expected behavior', () => {
      // Given
      const validator = isDate()
      const control = new FormControl('2024-12-25')

      // When
      const result = validator(control)

      // Then
      expect(result).toBeNull()
    })

  it('Given test context, When executing, Then validates expected behavior', () => {
      // Given
      const validator = isDate()
      const control = new FormControl('25-12-2024')

      // When
      const result = validator(control)

      // Then
      expect(result).toEqual({
        isDate: 'This field must be a valid date in the format YYYY-MM-DD!',
      })
    })

  it('Given test context, When executing, Then validates expected behavior', () => {
      // Given
      const validator = isDate()
      const control = new FormControl('2024-02-31')

      // When
      const result = validator(control)

      // Then
      expect(result).toEqual({ isDate: 'This field must be a valid date!' })
    })
  })

  describe('isDocument', () => {
  it('Given test context, When executing, Then validates expected behavior', () => {
      // Given
      const validator = isDocument({ documentType: 'DNI' })

      // When & Then
      expect(validator(new FormControl('12345678'))).toBeNull()
      expect(validator(new FormControl('1234'))).toEqual({
        isDocument: 'Este campo debe contener entre 7 y 8 dígitos!',
      })
    })

  it('Given test context, When executing, Then validates expected behavior', () => {
      // Given
      const validator = isDocument({ documentType: 'CT' })

      // When & Then
      expect(validator(new FormControl('12345678901'))).toBeNull()
      expect(validator(new FormControl('1234567890'))).toEqual({
        isDocument: 'Este campo debe contener 11 dígitos!',
      })
    })

  it('Given test context, When executing, Then validates expected behavior', () => {
      // Given
      const validator = isDocument({ documentType: 'CL' })

      // When & Then
      expect(validator(new FormControl('12345678901'))).toBeNull()
      expect(validator(new FormControl('ABC'))).toEqual({
        isDocument: 'Este campo debe contener solo números!',
      })
    })
  })

  describe('isFormSelectItem', () => {
  it('Given test context, When executing, Then validates expected behavior', () => {
      // Given
      const validator = isFormSelectItem()
      const control = new FormControl({ value: '1', label: 'One' })

      // When
      const result = validator(control)

      // Then
      expect(result).toBeNull()
    })

  it('Given test context, When executing, Then validates expected behavior', () => {
      // Given
      const validator = isFormSelectItem()
      const control = new FormControl('1')

      // When
      const result = validator(control)

      // Then
      expect(result).toEqual({ isFormSelectItem: 'Este campo debe ser una opción valida!' })
    })

  it('Given test context, When executing, Then validates expected behavior', () => {
      // Given
      const validator = isFormSelectItem()

      // When & Then
      expect(validator(new FormControl([]))).toEqual({
        isFormSelectItem: 'Este campo debe ser una opción valida!',
      })
      expect(validator(new FormControl({ foo: 'bar' }))).toEqual({
        isFormSelectItem: 'Este campo debe ser una opción valida!',
      })
    })

  it('Given test context, When executing, Then validates expected behavior', () => {
      // Given
      const validator = isFormSelectItem()

      // When & Then
      expect(validator(new FormControl(null))).toBeNull()
      expect(validator(new FormControl(''))).toBeNull()
    })
  })

  describe('mustMatch', () => {
  it('Given test context, When executing, Then validates expected behavior', () => {
      // Given
      const form = new FormGroup({
        password: new FormControl('secret'),
        repeat: new FormControl('different'),
      })

      const validator = mustMatch({
        controlName: 'password',
        mustMatchControlName: 'repeat',
        errorMessage: 'must match',
      })

      // When
      const resultBefore = validator(form)
      form.patchValue({ repeat: 'secret' })
      const resultAfter = validator(form)

      // Then
      expect(resultBefore).toEqual({ mustMatch: 'must match' })
      expect(resultAfter).toBeNull()
    })

  it('Given test context, When executing, Then validates expected behavior', () => {
      // Given
      const form = new FormGroup({})
      const validator = mustMatch({
        controlName: 'password',
        mustMatchControlName: 'repeat',
        errorMessage: 'must match',
      })

      // When
      const result = validator(form)

      // Then
      expect(result).toBeNull()
    })

  it('Given test context, When executing, Then validates expected behavior', () => {
      // Given
      const form = new FormGroup({
        password: new FormControl(''),
        repeat: new FormControl('secret'),
      })
      const validator = mustMatch({
        controlName: 'password',
        mustMatchControlName: 'repeat',
        errorMessage: 'must match',
      })

      // When
      const result = validator(form)

      // Then
      expect(result).toBeNull()
    })

  it('Given test context, When executing, Then validates expected behavior', () => {
      // Given
      const form = new FormGroup({
        password: new FormControl('secret'),
        repeat: new FormControl('different'),
      })
      const validator = mustMatch({
        controlName: 'password',
        mustMatchControlName: 'repeat',
        errorMessage: undefined as any,
      })

      // When
      const result = validator(form)

      // Then
      expect(result).toEqual({ mustMatch: true })
    })
  })

  describe('mustUnmatch', () => {
  it('Given test context, When executing, Then validates expected behavior', () => {
      // Given
      const form = new FormGroup({
        currentPassword: new FormControl('same'),
        newPassword: new FormControl('same'),
      })

      const validator = mustUnmatch({
        controlName: 'currentPassword',
        mustUnmatchControlName: 'newPassword',
        errorMessage: 'must be different',
      })

      // When
      const resultBefore = validator(form)
      form.patchValue({ newPassword: 'different' })
      const resultAfter = validator(form)

      // Then
      expect(resultBefore).toEqual({ mustUnmatch: 'must be different' })
      expect(resultAfter).toBeNull()
    })

  it('Given test context, When executing, Then validates expected behavior', () => {
      // Given
      const form = new FormGroup({})
      const validator = mustUnmatch({
        controlName: 'currentPassword',
        mustUnmatchControlName: 'newPassword',
        errorMessage: 'must be different',
      })

      // When
      const result = validator(form)

      // Then
      expect(result).toBeNull()
    })

  it('Given test context, When executing, Then validates expected behavior', () => {
      // Given
      const form = new FormGroup({
        currentPassword: new FormControl(''),
        newPassword: new FormControl('secret'),
      })
      const validator = mustUnmatch({
        controlName: 'currentPassword',
        mustUnmatchControlName: 'newPassword',
        errorMessage: 'must be different',
      })

      // When
      const result = validator(form)

      // Then
      expect(result).toBeNull()
    })

  it('Given test context, When executing, Then validates expected behavior', () => {
      // Given
      const form = new FormGroup({
        currentPassword: new FormControl('same'),
        newPassword: new FormControl('same'),
      })
      const validator = mustUnmatch({
        controlName: 'currentPassword',
        mustUnmatchControlName: 'newPassword',
        errorMessage: undefined as any,
      })

      // When
      const result = validator(form)

      // Then
      expect(result).toEqual({ mustUnmatch: true })
    })
  })

  describe('minimumAge', () => {
  it('Given test context, When executing, Then validates expected behavior', () => {
      // Given
      const now = new Date()
      const year = now.getFullYear() - 18
      const month = String(now.getMonth() + 1).padStart(2, '0')
      const day = String(now.getDate()).padStart(2, '0')

      const boundaryBirthDate = `${year}-${month}-${day}`
      const underAgeBirthDate = `${year + 1}-${month}-${day}`

      const validator = minimumAge({ minAge: 18 })

      // When & Then
      expect(validator(new FormControl(boundaryBirthDate))).toBeNull()
      expect(validator(new FormControl(underAgeBirthDate))).toEqual(
        expect.objectContaining({ minimumAge: expect.any(Object) }),
      )
      expect(validator(new FormControl(''))).toBeNull()
    })
  })
})
