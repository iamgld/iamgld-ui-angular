// Angular Imports
import {
  ChangeDetectionStrategy,
  Component,
  contentChildren,
  AfterContentInit,
  ElementRef,
  forwardRef,
  input,
  viewChild,
  effect,
  OnInit,
  inject,
  DestroyRef,
  ChangeDetectorRef,
  signal,
} from '@angular/core'
import { NgTemplateOutlet } from '@angular/common'
import {
  ControlValueAccessor,
  NG_VALUE_ACCESSOR,
  ReactiveFormsModule,
  FormControl,
} from '@angular/forms'
import { takeUntilDestroyed } from '@angular/core/rxjs-interop'
// This Module Imports
import { IconComponent } from '../../icon/icon.component'
import { InputErrorComponent } from '../input-error/input-error.component'
import { SelectOptionComponent } from '../select-option/select-option.component'
// Shared Imports
import { Icons, InputValue } from '@ui/models'
import { STRING_REGEX_TO_CLEAN } from '@ui/validators'
import { updateValueWithMask } from '@ui/utils'
// Thirdparty Imports
import { debounceTime } from 'rxjs'

const components = [IconComponent, InputErrorComponent]

@Component({
  selector: 'gld-select',
  standalone: true,
  imports: [ReactiveFormsModule, NgTemplateOutlet, ...components],
  templateUrl: './select.component.html',
  styleUrl: './select.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SelectComponent),
      multi: true,
    },
  ],
})
export class SelectComponent implements ControlValueAccessor, OnInit, AfterContentInit {
  readonly #destroyRef = inject(DestroyRef)
  readonly #changeDetectorRef = inject(ChangeDetectorRef)
  readonly Icons = Icons

  control = input.required<FormControl<unknown>>()
  id = input.required<string, string>({
    transform: (value: string) => `input-id-${value.trim().split(' ').join('-')}`,
  })
  name = input.required<string, string>({
    transform: (value: string) => `input-name-${value.trim().split(' ').join('-')}`,
  })
  label = input<string>('')
  placeholder = input<string>('')
  mask = input<string>('')
  transform = input<(value: unknown) => string>((value: unknown) => String(value))

  selectElement = viewChild<ElementRef<HTMLElement>>('selectElement')
  selectOptionChildren = contentChildren<SelectOptionComponent>(SelectOptionComponent)

  innerControl = signal(new FormControl<unknown>('', { nonNullable: true }))
  hasValidators = signal({
    required: false,
    naturalNumber: false,
    string: false,
    maxLength: null as number | null,
  })
  isMenuOpen = signal(false)

  // eslint-disable-next-line @typescript-eslint/no-empty-function, @typescript-eslint/no-unused-vars
  onChange = (value: unknown) => {}
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  onTouched = () => {}

  constructor() {
    effect(() => {
      if (this.selectOptionChildren()) this.#detectSelectOptionChildren()
    })

    this.innerControl()
      .valueChanges.pipe(takeUntilDestroyed(this.#destroyRef))
      .subscribe((value) => {
        let _value = value

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

        // Apply mask depends on the mask input
        const valueTransformed: string = this.#transformValue(_value) ?? ''
        if (value && Boolean(this.mask())) {
          const mask = updateValueWithMask({ value: valueTransformed, mask: this.mask() })
          this.innerControl().setValue(mask, { emitEvent: false })
        } else {
          this.innerControl().setValue(valueTransformed, { emitEvent: false })
        }

        // Emit value
        this.onChange(value)
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

  ngAfterContentInit(): void {
    this.#detectSelectOptionChildren()

    this.selectOptionChildren().map((selectOption: SelectOptionComponent) => {
      selectOption.changeFocus.subscribe((focus) => {
        // console.log('focus', focus)
        if (focus) this.onFocus()
        else this.onBlur()
      })
    })
  }

  writeValue(value: unknown): void {
    // console.log('writeValue')
    if (value !== this.innerControl().value) {
      // const valueTransformed = this.#transformValue(value)
      this.innerControl().setValue(value)
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

  onFocus() {
    this.isMenuOpen.set(true)
  }

  onBlur() {
    // console.log('blur')
    this.onTouched()
    this.isMenuOpen.set(false)
  }

  arrowIconClicked() {
    // FIXME: This is a workaround to prevent the menu from closing when the arrow icon is clicked.
    // console.log('clicked - init', this.isMenuOpen())
    if (this.isMenuOpen()) this.onTouched()
    this.isMenuOpen.update((open) => !open)
    // console.log('clicked - end', this.isMenuOpen())
  }

  #transformValue(value: unknown): string | null {
    let valueTransformed: string | null

    if (value === null || value === undefined) valueTransformed = null
    else valueTransformed = this.transform()(value)

    return valueTransformed
  }

  #detectSelectOptionChildren() {
    const selectOptionChildren = this.selectOptionChildren()
    const selectElement: HTMLElement | undefined = this.selectElement()?.nativeElement
    selectElement?.style.setProperty('--gld-option-items', String(selectOptionChildren.length))
    const clientHeight: number | undefined =
      selectElement?.querySelector('gld-select-option')?.clientHeight
    if (clientHeight) selectElement?.style.setProperty('--gld-option-height', `${clientHeight}px`)

    selectOptionChildren.map((selectOption) => {
      selectOption.selected.subscribe((value: InputValue) => {
        if (value) {
          const buttons = Array.from(
            selectElement?.querySelectorAll('gld-select-option button') ?? [],
          ) as HTMLButtonElement[]
          buttons.map((button) => button.blur())
          const valueTransformed = this.#transformValue(value)
          this.innerControl().setValue(valueTransformed, { emitEvent: false })
          this.onChange(value)
          this.onTouched()
          this.isMenuOpen.set(false)
        }
      })
    })
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
