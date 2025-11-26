// Angular Imports
import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms'
// Shared Imports
import { formatDateFromISOToYYYYMMDD } from '../../utils'

// Regex to validate the ISO date format (YYYY-MM-DD)
const ISO_DATE_REGEX = /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[1-2][0-9]|3[0-1])$/

export function isDateValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = formatDateFromISOToYYYYMMDD(control.value)

    if (!value) return null

    if (!ISO_DATE_REGEX.test(value))
      return { isDate: 'This field must be a valid date in the format YYYY-MM-DD!' }

    // Verify if the date is valid (additional logic)
    const [year, month, day] = value.split('-').map(Number)
    const date = new Date(year, month - 1, day)

    // Verify if the date is logical and corresponds to the format
    if (date.getFullYear() === year && date.getMonth() === month - 1 && date.getDate() === day)
      return null
    return { isDate: 'This field must be a valid date!' }
  }
}

