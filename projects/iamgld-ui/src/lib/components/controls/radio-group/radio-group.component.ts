// Angular Imports
import {
  AfterContentInit,
  ChangeDetectionStrategy,
  Component,
  contentChildren,
  effect,
  forwardRef,
  input,
} from '@angular/core'
import { ControlValueAccessor, NG_VALUE_ACCESSOR, FormControl } from '@angular/forms'
// This Module Imports
import { RadioDirection, InputValue } from '../../../models'
import { RadioButtonComponent } from '../radio-button/radio-button.component'
import { InputErrorComponent } from '../input-error/input-error.component'

const components = [InputErrorComponent]

@Component({
  selector: 'gld-radio-group',
  standalone: true,
  imports: [...components],
  templateUrl: './radio-group.component.html',
  styleUrl: './radio-group.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => RadioGroupComponent),
      multi: true,
    },
  ],
})
export class RadioGroupComponent implements ControlValueAccessor, AfterContentInit {
  control = input.required<FormControl<unknown>>()
  name = input.required<string>()
  label = input<string>('')
  direction = input<keyof typeof RadioDirection>(RadioDirection.horizontal)

  radioButtonChildren = contentChildren<RadioButtonComponent>(RadioButtonComponent)

  // eslint-disable-next-line @typescript-eslint/no-empty-function, @typescript-eslint/no-unused-vars
  onChange = (value: unknown) => {}
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  onTouched = () => {}

  constructor() {
    effect(() => {
      // console.log('control', this.control())
      const currentValue = this.control().value
      if (this.control().dirty || this.control().touched) {
        const newValue = this.control().value
        if (newValue !== currentValue) this.onChange(newValue)
      }

      this.updateErrorInChildren(
        this.control().invalid && (this.control().dirty || this.control().touched),
      )
    })
  }

  ngAfterContentInit(): void {
    this.radioButtonChildren().map((radioButton: RadioButtonComponent) => {
      radioButton.changeValue.subscribe((value) => this.updateCurrentInChildren(value))
      radioButton.changeFocus.subscribe((focus) => {
        if (!focus) this.onTouched()
      })
    })
  }

  updateCurrentInChildren(value: InputValue) {
    this.radioButtonChildren().map((radioButton: RadioButtonComponent, index: number) => {
      radioButton.current.set(value)
      // Set current one time
      if (index === 0) this.onChange(value)
    })
  }

  updateErrorInChildren(error: boolean) {
    this.radioButtonChildren().map((radioButton: RadioButtonComponent) =>
      radioButton.error.set(error),
    )
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

  setDisabledState(disabled: boolean): void {
    // console.log('setDisabledState')
    this.#updateDisabledInChildren(disabled)
  }

  #updateDisabledInChildren(disabled: boolean) {
    this.radioButtonChildren().map((radioButton: RadioButtonComponent) =>
      radioButton.disabled.set(disabled),
    )
  }
}
