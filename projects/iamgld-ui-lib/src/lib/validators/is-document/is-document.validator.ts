// Angular Imports
import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms'

export function isDocumentValidator({ documentType }: { documentType: DocumentType }): ValidatorFn {
	return (control: AbstractControl): ValidationErrors | null => {
		const value = control.value

		// Definir los patrones de acuerdo al tipo de vehículo
		const patterns: Patterns = {
			DNI: [
				{
					regex: /^\d+$/,
					message: 'Este campo debe contener solo números!',
				},
				{
					regex: /^.{7,8}$/,
					message: 'Este campo debe contener entre 7 y 8 dígitos!',
				},
			],
			CT: [
				{
					regex: /^\d+$/,
					message: 'Este campo debe contener solo números!',
				},
				{
					regex: /^.{11}$/,
					message: 'Este campo debe contener 11 dígitos!',
				},
			],
			CL: [
				{
					regex: /^\d+$/,
					message: 'Este campo debe contener solo números!',
				},
				{
					regex: /^.{11}$/,
					message: 'Este campo debe contener 11 dígitos!',
				},
			],
		}

		const patternsToValid = patterns[documentType]

		if (!value) return null

		const pattern = patternsToValid.find((pattern) => !pattern.regex.test(value))

		return pattern ? { isDocument: pattern.message } : null
	}
}

type DocumentType = 'DNI' | 'CT' | 'CL'

interface ValidationPattern {
	regex: RegExp
	message: string
}

interface Patterns {
	DNI: ValidationPattern[]
	CT: ValidationPattern[]
	CL: ValidationPattern[]
}

