// Angular Imports
import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms'

// Regex para validar el formato de fecha DD/MM/YYYY
const DATE_REGEX = /^(0[1-9]|[1-2][0-9]|3[0-1])\/(0[1-9]|1[0-2])\/\d{4}$/

export function isDateValidator(): ValidatorFn {
	return (control: AbstractControl): ValidationErrors | null => {
		const value = control.value

		if (!value) return null

		if (!DATE_REGEX.test(value))
			return { isDate: 'Este campo debe ser una fecha valida con formato DD/MM/YYYY!' }

		// Verificar si la fecha es válida (lógica adicional)
		const [day, month, year] = value.split('/').map(Number)
		const date = new Date(year, month - 1, day)

		// Verificar si la fecha es lógica y corresponde con el formato
		if (date.getFullYear() === year && date.getMonth() === month - 1 && date.getDate() === day)
			return null
		else return { isDate: 'Este campo debe ser una fecha valida!' }
	}
}

