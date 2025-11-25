// Angular Imports
import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms'

export function isFormSelectItemValidator(): ValidatorFn {
	return (control: AbstractControl): ValidationErrors | null => {
		const value = control.value

		if (!value) return null
		if (typeof value === 'string')
			return { isFormSelectItem: 'Este campo debe ser una opción valida!' }

		if (typeof value === 'object') {
			if ('value' in value && 'label' in value) return null
		}

		return { isFormSelectItem: 'Este campo debe ser una opción valida!' }
	}
}

