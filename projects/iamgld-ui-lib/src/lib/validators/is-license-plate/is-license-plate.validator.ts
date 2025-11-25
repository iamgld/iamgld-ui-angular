// Angular Imports
import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms'

export function isLicensePlateValidator({
	vehicleType,
}: {
	vehicleType: 'AUTO' | 'MOTO' | 'BOTH'
}): ValidatorFn {
	return (control: AbstractControl): ValidationErrors | null => {
		const value = control.value

		// Definir los patrones de acuerdo al tipo de vehículo
		const patterns = {
			AUTO: [
				/^[a-zA-Z]{3}[\d]{3}$/, // Auto viejo
				/^[a-zA-Z]{2}[\d]{3}[a-zA-Z]{2}$/, // Auto nuevo
			],
			MOTO: [
				/^[\d]{3}[a-zA-Z]{3}$/, // Moto viejo
				/^[a-zA-Z]{1}[\d]{3}[a-zA-Z]{3}$/, // Moto nuevo
			],
			BOTH: [
				/^[a-zA-Z]{3}[\d]{3}$/, // Auto viejo
				/^[a-zA-Z]{2}[\d]{3}[a-zA-Z]{2}$/, // Auto nuevo
				/^[\d]{3}[a-zA-Z]{3}$/, // Moto viejo
				/^[a-zA-Z]{1}[\d]{3}[a-zA-Z]{3}$/, // Moto nuevo
			],
		}

		const patternsToValid = patterns[vehicleType]

		if (!value) return null

		const isValid = patternsToValid.some((pattern) => pattern.test(value))

		return isValid ? null : { isLicensePlate: 'El campo debe ser una patente valida!' }
	}
}

