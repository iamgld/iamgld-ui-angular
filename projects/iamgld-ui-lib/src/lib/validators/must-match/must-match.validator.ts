// Angular Imports
import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms'

export function mustMatchValidator({
	controlName,
	mustMatchControlName,
	errorMessage,
}: {
	controlName: string
	mustMatchControlName: string
	errorMessage: string
}): ValidatorFn {
	return (formGroup: AbstractControl): ValidationErrors | null => {
		const firstControl = formGroup.get(controlName)
		const mustMatchControl = formGroup.get(mustMatchControlName)

		// Validar que ambos controles existan
		if (!firstControl || !mustMatchControl) return null

		// Verificar si los valores coinciden
		if (firstControl.value && firstControl.value !== mustMatchControl.value) {
			mustMatchControl.setErrors({ ...mustMatchControl.errors, mustMatch: errorMessage ?? true })
			return { mustMatch: errorMessage ?? true }
		}

		return null // Es válido si no hay errores
	}
}

