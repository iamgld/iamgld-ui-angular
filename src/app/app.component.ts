// Angular Imports
import { Component, inject } from '@angular/core'
import { FormControl, NonNullableFormBuilder, ReactiveFormsModule } from '@angular/forms'
// @iamgld/ui  Imports
import { ButtonComponent, InputComponent, SelectComponent, SelectOptionComponent } from '@iamgld/ui'

const components = [ButtonComponent, InputComponent, SelectComponent, SelectOptionComponent]

@Component({
  selector: 'gld-root',
  imports: [ReactiveFormsModule, ...components],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  readonly #fb = inject(NonNullableFormBuilder)

  readonly form = this.#fb.group<Form>({
    name: this.#fb.control(''),
    comments: this.#fb.control(''),
  })
}

interface Form {
  name: FormControl<string>
  comments: FormControl<string>
}
