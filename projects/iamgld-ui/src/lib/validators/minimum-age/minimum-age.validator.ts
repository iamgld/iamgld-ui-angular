// Angular Imports
import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms'

export function minimumAgeValidator({ minAge }: { minAge: number }): ValidatorFn {
	return (control: AbstractControl): ValidationErrors | null => {
		const value = control.value

		if (!value) return null

		// Convertir la fecha del formato DD/MM/YYYY a un objeto Date
		const [day, month, year] = value.split('/').map(Number)
		const birthDay = new Date(year, month - 1, day)

		// Obtener la fecha actual y calcular la diferencia de años
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

