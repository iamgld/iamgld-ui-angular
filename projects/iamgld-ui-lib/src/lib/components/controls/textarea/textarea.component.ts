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
import { InputType } from '../../../models'
import { NATURAL_NUMBER_REGEX_TO_CLEAN, STRING_REGEX_TO_CLEAN } from '../../../validators'
// This Module Imports
import { InputError } from '../input-error/input-error.component'

const components = [InputError]

@Component({
  selector: 'gld-textarea',
  imports: [ReactiveFormsModule, NgTemplateOutlet, ...components],
  templateUrl: './textarea.html',
  styleUrl: './textarea.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => Textarea),
      multi: true,
    },
  ],
})
export class Textarea implements ControlValueAccessor, OnInit {
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
  placeholder = input<string>('')
  type = input<InputType>('text')
  suffix = input<boolean, boolean | string>(false, { transform: booleanAttribute })

  // eslint-disable-next-line no-unused-vars
  onChange = (value: unknown) => {}
  onTouched = () => {}

  innerControl = signal(new FormControl<unknown>('', { nonNullable: true }))
  hasValidators = signal({
    required: false,
    naturalNumber: false,
    string: false,
    maxLength: null as number | null,
  })

  constructor() {
    this.innerControl()
      .valueChanges.pipe(takeUntilDestroyed(this.#destroyRef))
      .subscribe((value) => {
        let _value = value

        /**
         * Removes all non-digit characters from the input value string.
         * This sanitizes the value input by keeping only numbers (0-9)
         *
         * @example
         * // Input: "12/34/abcd2023!@_"
         * // Output: "12342023"
         */

        if (String(value) && this.hasValidators().naturalNumber) {
          _value = String(value).replaceAll(NATURAL_NUMBER_REGEX_TO_CLEAN, '')
          this.innerControl().markAsUntouched()
        }

        /**
         * Removes all non-letter and non-space characters from the input value string.
         * This sanitizes the value input by keeping only letters (a-z, A-Z, with accents like á, é, í, ó, ú, ñ) and spaces.
         * Numbers, special characters, and symbols are removed.
         *
         * @example
         * // Input: "Juan123@García#456 Pérez$"
         * // Output: "JuanGarcía Pérez"
         */
        if (String(value) && this.hasValidators().string) {
          _value = String(value).replaceAll(STRING_REGEX_TO_CLEAN, '')
          this.innerControl().markAsUntouched()
        }

        // Emit value
        this.onChange(_value)
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
    if (value !== this.innerControl().value) this.innerControl().setValue(value)
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
      maxLength: maxLength ? maxLength : null,
    })
    // console.log('hasValidators', this.hasValidators())
  }
}
