// Angular Imports
import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms'

export function mustUnmatchValidator({
	controlName,
	mustUnmatchControlName,
	errorMessage,
}: {
	controlName: string
	mustUnmatchControlName: string
	errorMessage: string
}): ValidatorFn {
	return (formGroup: AbstractControl): ValidationErrors | null => {
		const firstControl = formGroup.get(controlName)
		const mustUnmatchControl = formGroup.get(mustUnmatchControlName)

		// Validar que ambos controles existan
		if (!firstControl || !mustUnmatchControl) return null

		// Verificar si los valores coinciden
		if (firstControl.value && firstControl.value === mustUnmatchControl.value) {
			mustUnmatchControl.setErrors({
				...mustUnmatchControl.errors,
				mustUnmatch: errorMessage ?? true,
			})
			return { mustUnmatch: errorMessage ?? true }
		}

		return null // Es válido si no hay errores
	}
}

