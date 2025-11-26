// Angular Imports
import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms'

// Regex para validar string y acepta acentos y espacios
export const STRING_REGEX = /^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s]+$/
export const STRING_REGEX_TO_CLEAN = /[^a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s]/g

export function isStringValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = String(control.value).trim()

    if (!value) return null

    if (STRING_REGEX.test(value)) return null
    return { isString: 'Debes ingresar solo caracteres.' }
  }
}
