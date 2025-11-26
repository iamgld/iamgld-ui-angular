// Angular Imports
import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms'

// Regex para validar números naturales (0, 1, 2, 3, ...)
export const NATURAL_NUMBER_REGEX = /^[0-9]+$/
export const NATURAL_NUMBER_REGEX_TO_CLEAN = /[^0-9]/g

export function isNaturalNumberValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = String(control.value).trim()

    if (!value) return null

    if (NATURAL_NUMBER_REGEX.test(value)) return null
    return { isNaturalNumber: 'Debes ingresar solo números.' }
  }
}
