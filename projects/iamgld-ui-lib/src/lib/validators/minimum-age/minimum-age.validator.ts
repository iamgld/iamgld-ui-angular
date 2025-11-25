// Angular Imports
import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms'
// Shared Imports
import { formatDateFromISOToYYYYMMDD } from '../../utils'

export function minimumAgeValidator({ minAge }: { minAge: number }): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = formatDateFromISOToYYYYMMDD(control.value)

    if (!value) return null

    // Verify if the date is valid (additional logic)
    const [year, month, day] = value.split('-').map(Number)
    const birthDay = new Date(year, month - 1, day)

    // Get the current date and calculate the difference in years
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const age = today.getFullYear() - birthDay.getFullYear()
    const isMonthPast = today.getMonth() > birthDay.getMonth()
    const isSameMonthDayPast =
      today.getMonth() === birthDay.getMonth() && today.getDate() >= birthDay.getDate()

    const isValidAge = age > minAge || (age === minAge && (isMonthPast || isSameMonthDayPast))

    // Retornar el error si la edad es menor al mínimo
    return isValidAge ? null : { minimumAge: { requiredAge: minAge, actualAge: age } }
  }
}

