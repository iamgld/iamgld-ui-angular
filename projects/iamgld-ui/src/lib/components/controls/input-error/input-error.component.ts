// Angular Imports
import { ChangeDetectionStrategy, Component, input } from '@angular/core'
import { ValidationErrors } from '@angular/forms'

@Component({
	selector: 'gld-input-error',
	standalone: true,
	imports: [],
	templateUrl: './input-error.component.html',
	styleUrl: './input-error.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InputErrorComponent {
	errors = input.required<ValidationErrors | null>()
}
