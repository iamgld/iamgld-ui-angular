// Angular Imports
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  DestroyRef,
  OnInit,
  booleanAttribute,
  forwardRef,
  inject,
  input,
  signal,
} from '@angular/core'
import { takeUntilDestroyed } from '@angular/core/rxjs-interop'
import {
  ReactiveFormsModule,
  ControlValueAccessor,
  NG_VALUE_ACCESSOR,
  FormControl,
} from '@angular/forms'
import { NgTemplateOutlet } from '@angular/common'
// This Module Imports
import { InputErrorComponent } from '../input-error/input-error.component'
import { formatDateToISO, formatDateFromISOToYYYYMMDD } from '../../../utils'
// Thirdparty Imports
import { debounceTime } from 'rxjs'

const components = [InputErrorComponent]

@Component({
  selector: 'gld-input-date',
  standalone: true,
  imports: [ReactiveFormsModule, NgTemplateOutlet, ...components],
  templateUrl: './input-date.component.html',
  styleUrl: './input-date.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InputDateComponent),
      multi: true,
    },
  ],
})
export class InputDateComponent implements ControlValueAccessor, OnInit {
  readonly #destroyRef = inject(DestroyRef)
  readonly #changeDetectorRef = inject(ChangeDetectorRef)

  control = input.required<FormControl<unknown>>()
  name = input.required<string>()
  label = input<string>('')
  min = input<string | null, string>('', {
    transform: (value: string) => formatDateFromISOToYYYYMMDD(value),
  })
  max = input<string | null, string>('', {
    transform: (value: string) => formatDateFromISOToYYYYMMDD(value),
  })
  placeholder = input<string>('')
  suffix = input<boolean, boolean | string>(false, { transform: booleanAttribute })

  innerControl = signal(new FormControl<unknown>('', { nonNullable: true }))

  // eslint-disable-next-line @typescript-eslint/no-empty-function, @typescript-eslint/no-unused-vars
  onChange = (value: unknown) => {}
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  onTouched = () => {}

  constructor() {
    this.innerControl()
      .valueChanges.pipe(takeUntilDestroyed(this.#destroyRef))
      .subscribe((value) => {
        this.onChange(value)
        if (value && typeof value === 'string') {
          const valueTransformed = formatDateFromISOToYYYYMMDD(formatDateToISO(value))
          this.innerControl().setValue(valueTransformed, { emitEvent: false })
        }
      })
  }

  ngOnInit(): void {
    // Subscribes to the form control's events and triggers change detection to update the view accordingly.
    this.control()
      .events.pipe(takeUntilDestroyed(this.#destroyRef), debounceTime(100))
      .subscribe(() => this.#changeDetectorRef.detectChanges())
  }

  writeValue(value: unknown): void {
    // console.log('writeValue')
    if (value !== this.innerControl().value) this.innerControl().setValue(String(value))
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

