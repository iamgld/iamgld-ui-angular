// Angular Imports

import { NgTemplateOutlet } from '@angular/common'
import {
  booleanAttribute,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  DestroyRef,
  forwardRef,
  inject,
  input,
  OnInit,
  signal,
} from '@angular/core'
import { takeUntilDestroyed } from '@angular/core/rxjs-interop'
import {
  ControlValueAccessor,
  FormControl,
  NG_VALUE_ACCESSOR,
  ReactiveFormsModule,
} from '@angular/forms'
// Thirdparty Imports
import { debounceTime } from 'rxjs'
import {
  formatDDMMYYYYToISODate,
  formatISODateToDDMMYYYY,
  updateValueWithMask,
} from '../../../utils'
// This Module Imports
import { InputError } from '../input-error/input-error'

const components = [InputError]

@Component({
  selector: 'gld-input-date',
  imports: [ReactiveFormsModule, NgTemplateOutlet, ...components],
  templateUrl: './input-date.html',
  styleUrl: './input-date.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InputDate),
      multi: true,
    },
  ],
})
export class InputDate implements ControlValueAccessor, OnInit {
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
  min = input<string | null, string>('', {
    transform: (value: string) => formatISODateToDDMMYYYY({ date: value }),
  })
  max = input<string | null, string>('', {
    transform: (value: string) => formatISODateToDDMMYYYY({ date: value }),
  })
  placeholder = input<string>('')
  mask = input<string>('')
  suffix = input<boolean, boolean | string>(false, { transform: booleanAttribute })

  innerControl = signal(new FormControl<unknown>('', { nonNullable: true }))
  hasValidators = signal({
    required: false,
    naturalNumber: false,
    string: false,
    maxLength: null as number | null,
  })

  // eslint-disable-next-line no-unused-vars
  onChange = (value: unknown) => {}
  onTouched = () => {}

  constructor() {
    this.innerControl()
      .valueChanges.pipe(takeUntilDestroyed(this.#destroyRef))
      .subscribe((value) => {
        /**
         * Removes all non-digit and non-slash characters from the input value string.
         * This sanitizes the date input by keeping only numbers (0-9) and forward slashes (/)
         * which are typically used in date formats like MM/DD/YYYY or DD/MM/YYYY.
         *
         * @example
         * // Input: "12/34/abcd2023!@_"
         * // Output: "12/34/2023"
         */
        const _value = String(value).replaceAll(/[^\d/]/g, '')

        if (String(value) && Boolean(this.mask())) {
          const masked: string = updateValueWithMask({ value: _value, mask: this.mask() })
          this.innerControl().setValue(masked, { emitEvent: false })
        }

        const valueTransformed: string | null = formatDDMMYYYYToISODate({
          date: _value,
        })
        this.onChange(valueTransformed ?? 'Invalid Date')
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
      .subscribe(() => this.#changeDetectorRef.detectChanges())
  }

  writeValue(value: unknown): void {
    // console.log('writeValue')
    if (value !== this.innerControl().value) this.innerControl().setValue(String(value))
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

  onFocus() {
    // this.isMenuOpen.set(true)
  }

  onBlur() {
    this.onTouched()
    // this.isMenuOpen.set(false)
  }

  #updateHasValidators(): void {
    const control = this.control()
    const validatorFn = control.validator
    const maskSpacers = this.mask()
      .split('')
      .filter((char) => char !== '0').length

    // It isn't validators
    if (validatorFn === null) {
      this.hasValidators.set({
        required: false,
        naturalNumber: false,
        string: false,
        maxLength: null,
      })
      return
    }

    // Detect all validators
    const requiredErrors = validatorFn(new FormControl(''))
    const typeErrors = validatorFn(new FormControl('abc123'))
    const maxLengthErrors = validatorFn(new FormControl({ length: Infinity }))
    const maxLength: number = maxLengthErrors?.['maxlength']?.['requiredLength']

    this.hasValidators.set({
      required: Boolean(requiredErrors?.['required']),
      naturalNumber: Boolean(typeErrors?.['isNaturalNumber']),
      string: Boolean(typeErrors?.['isString']),
      maxLength: maxLength ? maxLength + maskSpacers : null,
    })
    // console.log('hasValidators', this.hasValidators())
  }
}
