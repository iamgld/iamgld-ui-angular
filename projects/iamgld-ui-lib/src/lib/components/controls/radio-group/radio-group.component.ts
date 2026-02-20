// Angular Imports
import {
  AfterContentInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  contentChildren,
  DestroyRef,
  forwardRef,
  inject,
  input,
  OnInit,
  signal,
} from '@angular/core'
import { takeUntilDestroyed } from '@angular/core/rxjs-interop'
import { ControlValueAccessor, FormControl, NG_VALUE_ACCESSOR } from '@angular/forms'
// Thirdparty Imports
import { debounceTime } from 'rxjs'
import { RADIO_DIRECTIONS, RadioDirection } from '../../../models'
import { InputErrorComponent } from '../input-error/input-error.component'
// This Module Imports
import { RadioButtonComponent } from '../radio-button/radio-button.component'

const components = [InputErrorComponent]

@Component({
  selector: 'gld-radio-group',
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
export class RadioGroupComponent implements ControlValueAccessor, OnInit, AfterContentInit {
  readonly #destroyRef = inject(DestroyRef)
  readonly #changeDetectorRef = inject(ChangeDetectorRef)

  control = input.required<FormControl<unknown>>()
  id = input.required<string, string>({
    transform: (value: string) => `input-id-${value.trim().split(' ').join('-')}`,
  })
  name = input.required<string, string>({
    transform: (value: string) => `input-name-${value.trim().split(' ').join('-')}`,
  })
  label = input<string>('')
  direction = input<RadioDirection>(RADIO_DIRECTIONS.horizontal)

  radioButtonChildren = contentChildren<RadioButtonComponent>(RadioButtonComponent)
  innerControl = signal(new FormControl<unknown>('', { nonNullable: true }))
  hasValidators = signal({
    required: false,
  })

  // eslint-disable-next-line no-unused-vars
  onChange = (value: unknown) => {}
  onTouched = () => {}

  constructor() {
    this.innerControl()
      .valueChanges.pipe(takeUntilDestroyed(this.#destroyRef))
      .subscribe((value) => {
        this.onChange(value)
        if (value) this.updateCurrentInChildren(value)
      })
  }

  ngOnInit(): void {
    // Initialize validators cache
    this.#updateHasValidators()

    // Update validators when then changed in control
    this.control()
      .statusChanges.pipe(takeUntilDestroyed(this.#destroyRef))
      .subscribe(() => this.#updateHasValidators())

    // Subscribes to the form control's events and triggers change detection to update the view accordingly.
    this.control()
      .events.pipe(takeUntilDestroyed(this.#destroyRef), debounceTime(10))
      .subscribe(() => {
        this.updateErrorInChildren(
          this.control().invalid && (this.control().dirty || this.control().touched),
        )
        this.#changeDetectorRef.detectChanges()
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

  updateCurrentInChildren(value: unknown) {
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
    if (value !== this.innerControl().value) {
      this.innerControl().setValue(value)
    }
  }

  // eslint-disable-next-line no-unused-vars
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

  #updateHasValidators(): void {
    const control = this.control()
    const validatorFn = control.validator

    // It isn't validators
    if (validatorFn === null) {
      this.hasValidators.set({
        required: false,
      })
      return
    }

    // Detect all validators
    const requiredErrors = validatorFn(new FormControl(''))

    this.hasValidators.set({
      required: Boolean(requiredErrors?.['required']),
    })
    // console.log('hasValidators', this.hasValidators())
  }
}
