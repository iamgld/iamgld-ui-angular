// Angular Imports
import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms'

// Regex para validar números naturales (0, 1, 2, 3, ...)
const NATURAL_NUMBER_REGEX = /^[0-9]+$/

export function isNaturalNumberValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value

    if (!value) return null

    if (NATURAL_NUMBER_REGEX.test(value)) return null
    return { naturalNumber: 'This field must contain only valid numbers!' }
  }
}

