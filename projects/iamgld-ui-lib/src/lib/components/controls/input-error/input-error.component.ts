// Angular Imports
import { NgTemplateOutlet } from '@angular/common'
import {
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  input,
  contentChildren,
  signal,
  effect,
} from '@angular/core'
import { ValidationErrors } from '@angular/forms'
// Shared Imports
import { InputErrorMessageDirective } from '@ui/directives'

@Component({
  selector: 'gld-input-error',
  standalone: true,
  imports: [NgTemplateOutlet],
  templateUrl: './input-error.component.html',
  styleUrl: './input-error.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InputErrorComponent {
  readonly Boolean = Boolean
  errors = input.required<ValidationErrors | null>()
  border = input<boolean, boolean | string>(false, { transform: booleanAttribute })
  content = contentChildren(InputErrorMessageDirective, {
    descendants: true,
  })

  hasContent = signal(false)
  firstErrorKey = signal<string | null>(null)

  constructor() {
    effect(() => this.hasContent.set(this.content()?.length ? true : false), {
      allowSignalWrites: true,
    })
    effect(() => this.#resolveFirstErrorKey(this.errors()), { allowSignalWrites: true })
  }

  #resolveFirstErrorKey(errors: ValidationErrors | null): void {
    this.firstErrorKey.set(Object.keys(errors || {})[0] ?? null)
  }
}
