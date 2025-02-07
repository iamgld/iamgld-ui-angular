// Angular Imports
import { Component, inject, signal } from '@angular/core'
import {
  FormControl,
  NonNullableFormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms'
// @iamgld/ui  Imports
import {
  ButtonComponent,
  IconButtonComponent,
  InputComponent,
  InputHintComponent,
  InputErrorComponent,
  InputDateComponent,
  TextareaComponent,
  isDateValidator,
  RadioGroupComponent,
  RadioButtonComponent,
  SelectComponent,
  SelectOptionComponent,
  InputErrorMessageDirective,
  TileComponent,
  Icons,
  LoaderComponent,
  LinkComponent,
  ToggleGroupComponent,
  ToggleButtonComponent,
} from '@iamgld/ui'

const components = [
  ButtonComponent,
  LinkComponent,
  IconButtonComponent,
  InputComponent,
  InputHintComponent,
  InputErrorComponent,
  InputDateComponent,
  TextareaComponent,
  RadioGroupComponent,
  RadioButtonComponent,
  SelectComponent,
  SelectOptionComponent,
  TileComponent,
  LoaderComponent,
  ToggleGroupComponent,
  ToggleButtonComponent,
]

const directives = [InputErrorMessageDirective]

@Component({
  selector: 'gld-app',
  imports: [ReactiveFormsModule, ...components, ...directives],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  readonly #fb = inject(NonNullableFormBuilder)
  readonly Icons = Icons

  readonly form = this.#fb.group<Form>({
    firstName: this.#fb.control('', { validators: [Validators.required] }),
    lastName: this.#fb.control('', { validators: [Validators.required] }),
    date: this.#fb.control('', { validators: [Validators.required, isDateValidator()] }),
    comments: this.#fb.control('', { validators: [Validators.required] }),
    agree: this.#fb.control({ value: '', disabled: false }, { validators: [Validators.required] }),
    gender: this.#fb.control('', { validators: [Validators.required] }),
    toggle: this.#fb.control('en', { validators: [] }),
  })

  readonly genders = signal<FormSelectOption[]>([
    { label: 'Masculino', value: 'male' },
    { label: 'Femenino', value: 'female' },
  ])

  constructor() {
    // console.log('date', this.form.controls.date)
    this.form.controls.date.statusChanges.subscribe((status) => {
      console.log('status', status)
      console.log('toggle', this.form.controls.toggle)
    })
  }

  transformSelect(value: unknown): string {
    const formSelectOption = value as FormSelectOption
    return String(formSelectOption.label)
  }

  submit() {
    if (this.form.valid) {
      console.log(this.form.value)
    } else {
      this.form.markAllAsTouched()
      this.form.markAsDirty()
    }
  }
}

interface Form {
  firstName: FormControl<string>
  lastName: FormControl<string>
  date: FormControl<string>
  comments: FormControl<string>
  agree: FormControl<string>
  gender: FormControl<string>
  toggle: FormControl<string>
}

export interface FormSelectOption {
  value: string
  label: string
}
