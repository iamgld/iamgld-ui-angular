// Angular Imports
import {
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  effect,
  forwardRef,
  input,
} from '@angular/core'
import { NgTemplateOutlet } from '@angular/common'
import {
  ControlValueAccessor,
  NG_VALUE_ACCESSOR,
  FormControl,
  ReactiveFormsModule,
} from '@angular/forms'
// This Module Imports
import { InputType } from '../../../models/controls'
import { InputErrorComponent } from '../input-error/input-error.component'

const components = [InputErrorComponent]

@Component({
  selector: 'gld-textarea',
  standalone: true,
  imports: [ReactiveFormsModule, NgTemplateOutlet, ...components],
  templateUrl: './textarea.component.html',
  styleUrl: './textarea.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => TextareaComponent),
      multi: true,
    },
  ],
})
export class TextareaComponent implements ControlValueAccessor {
  control = input.required<FormControl<unknown>>()
  name = input.required<string>()
  label = input<string>('')
  placeholder = input<string>('')
  type = input<InputType>('text')
  suffix = input<boolean, boolean | string>(false, { transform: booleanAttribute })

  // eslint-disable-next-line @typescript-eslint/no-empty-function, @typescript-eslint/no-unused-vars
  onChange = (value: unknown) => {}
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  onTouched = () => {}

  constructor() {
    effect(() => {
      // console.log(this.control())
      const currentValue = this.control().value
      if (this.control().dirty || this.control().touched) {
        const newValue = this.control().value
        if (newValue !== currentValue) this.onChange(newValue)
      }
    })
  }

  writeValue(value: unknown): void {
    // console.log('writeValue')
    if (value !== this.control().value) {
      this.control().setValue(value, { emitEvent: false })
    }
  }

  registerOnChange(onChange: (value: unknown) => void): void {
    // console.log('registerOnChange')
    this.onChange = onChange
  }

  registerOnTouched(onTouched: () => void): void {
    // console.log('registerOnTouched')
    this.onTouched = onTouched
  }
}
