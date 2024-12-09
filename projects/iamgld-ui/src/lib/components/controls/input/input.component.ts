// Angular Imports
import {
  ChangeDetectionStrategy,
  Component,
  booleanAttribute,
  effect,
  forwardRef,
  input,
} from '@angular/core'
import {
  ReactiveFormsModule,
  ControlValueAccessor,
  NG_VALUE_ACCESSOR,
  FormControl,
} from '@angular/forms'
import { NgTemplateOutlet } from '@angular/common'
// This Module Imports
import { InputType } from '../../../models'
import { InputErrorComponent } from '../input-error/input-error.component'

const components = [InputErrorComponent]

@Component({
  selector: 'gld-input',
  standalone: true,
  imports: [ReactiveFormsModule, NgTemplateOutlet, ...components],
  templateUrl: './input.component.html',
  styleUrl: './input.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InputComponent),
      multi: true,
    },
  ],
})
export class InputComponent implements ControlValueAccessor {
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
