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
  it('isEmail validates valid and invalid emails', () => {
    const validator = isEmail()
    expect(validator(new FormControl('user@mail.com'))).toBeNull()
    expect(validator(new FormControl('invalid-email'))).toEqual({
      email: 'This field must be a valid email!',
    })
    expect(validator(new FormControl(''))).toBeNull()
  })

  it('isString validates letters, spaces and accents', () => {
    const validator = isString()
    expect(validator(new FormControl('Árbol ñandú'))).toBeNull()
    expect(validator(new FormControl('abc123'))).toEqual({
      isString: 'Debes ingresar solo caracteres.',
    })
    expect(validator(new FormControl(null))).toBeNull()
  })

  it('isNaturalNumber validates integers >= 0', () => {
    const validator = isNaturalNumber()
    expect(validator(new FormControl('0'))).toBeNull()
    expect(validator(new FormControl('12345'))).toBeNull()
    expect(validator(new FormControl('12.3'))).toEqual({
      isNaturalNumber: 'Debes ingresar solo números.',
    })
  })

  it('isDate validates ISO format and logical date', () => {
    const validator = isDate()
    expect(validator(new FormControl('2024-12-25'))).toBeNull()
    expect(validator(new FormControl('25-12-2024'))).toEqual({
      isDate: 'This field must be a valid date in the format YYYY-MM-DD!',
    })
    expect(validator(new FormControl('2024-02-31'))).toEqual({
      isDate: 'This field must be a valid date!',
    })
  })

  it('isDocument validates by document type', () => {
    expect(isDocument({ documentType: 'DNI' })(new FormControl('12345678'))).toBeNull()
    expect(isDocument({ documentType: 'DNI' })(new FormControl('1234'))).toEqual({
      isDocument: 'Este campo debe contener entre 7 y 8 dígitos!',
    })

    expect(isDocument({ documentType: 'CT' })(new FormControl('12345678901'))).toBeNull()
    expect(isDocument({ documentType: 'CL' })(new FormControl('ABC'))).toEqual({
      isDocument: 'Este campo debe contener solo números!',
    })
  })

  it('isFormSelectItem validates expected object shape', () => {
    const validator = isFormSelectItem()
    expect(validator(new FormControl({ value: '1', label: 'One' }))).toBeNull()
    expect(validator(new FormControl('1'))).toEqual({
      isFormSelectItem: 'Este campo debe ser una opción valida!',
    })
    expect(validator(new FormControl([]))).toEqual({
      isFormSelectItem: 'Este campo debe ser una opción valida!',
    })
  })

  it('mustMatch validates matching controls', () => {
    const form = new FormGroup({
      password: new FormControl('secret'),
      repeat: new FormControl('different'),
    })

    const validator = mustMatch({
      controlName: 'password',
      mustMatchControlName: 'repeat',
      errorMessage: 'must match',
    })

    expect(validator(form)).toEqual({ mustMatch: 'must match' })
    form.patchValue({ repeat: 'secret' })
    expect(validator(form)).toBeNull()
  })

  it('mustUnmatch validates different controls', () => {
    const form = new FormGroup({
      currentPassword: new FormControl('same'),
      newPassword: new FormControl('same'),
    })

    const validator = mustUnmatch({
      controlName: 'currentPassword',
      mustUnmatchControlName: 'newPassword',
      errorMessage: 'must unmatch',
    })

    expect(validator(form)).toEqual({ mustUnmatch: 'must unmatch' })
    form.patchValue({ newPassword: 'different' })
    expect(validator(form)).toBeNull()
  })

  it('minimumAge validates boundary and under-limit values', () => {
    const now = new Date()
    const year = now.getFullYear() - 18
    const month = String(now.getMonth() + 1).padStart(2, '0')
    const day = String(now.getDate()).padStart(2, '0')

    const boundaryBirthDate = `${year}-${month}-${day}`
    const underAgeBirthDate = `${year + 1}-${month}-${day}`

    const validator = minimumAge({ minAge: 18 })
    expect(validator(new FormControl(boundaryBirthDate))).toBeNull()
    expect(validator(new FormControl(underAgeBirthDate))).toEqual(
      expect.objectContaining({ minimumAge: expect.any(Object) }),
    )
    expect(validator(new FormControl(''))).toBeNull()
  })
})
