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
// This Module Imports
import { InputErrorMessageDirective } from '../../../directives'

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

  constructor() {
    effect(() => this.hasContent.set(this.content()?.length ? true : false))
  }
}
