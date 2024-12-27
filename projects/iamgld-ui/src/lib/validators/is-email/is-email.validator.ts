// Angular Imports
import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms'

// Regex para validar emails
const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/

export function isEmailValidator(): ValidatorFn {
	return (control: AbstractControl): ValidationErrors | null => {
		const value = control.value

		if (!value) return null

		if (EMAIL_REGEX.test(value)) return null
		else return { email: 'Este campo debe ser un email valido!' }
	}
}

