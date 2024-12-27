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
    transform: (value: string) => this.#formatDateToYYYYMMDD(value),
  })
  max = input<string | null, string>('', {
    transform: (value: string) => this.#formatDateToYYYYMMDD(value),
  })
  placeholder = input<string>('')
  suffix = input<boolean, boolean | string>(false, { transform: booleanAttribute })

  innerControl = signal(new FormControl<unknown>(''))

  // eslint-disable-next-line @typescript-eslint/no-empty-function, @typescript-eslint/no-unused-vars
  onChange = (value: unknown) => {}
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  onTouched = () => {}

  constructor() {
    this.innerControl()
      .valueChanges.pipe(takeUntilDestroyed(this.#destroyRef))
      .subscribe((value) => {
        const valueTransformed = this.#formatDateToDDMMYYYY(String(value))
        this.onChange(valueTransformed)
      })
  }

  ngOnInit(): void {
    // Subscribes to the form control's events and triggers change detection to update the view accordingly.
    this.control()
      .events.pipe(takeUntilDestroyed(this.#destroyRef))
      .subscribe(() => this.#changeDetectorRef.detectChanges())
  }

  writeValue(value: unknown): void {
    // console.log('writeValue')
    if (value !== this.innerControl().value) this.innerControl().setValue(value)
  }

  registerOnChange(onChange: (value: unknown) => void): void {
    // console.log('registerOnChange')
    this.onChange = onChange
  }

  registerOnTouched(onTouched: () => void): void {
    // console.log('registerOnTouched')
    this.onTouched = onTouched
  }

  #formatDateToDDMMYYYY(dateAsString: string): string | null {
    const [year, month, day] = dateAsString.split('-')
    if (year && month && day) return `${day}/${month}/${year}`
    else return null
  }

  #formatDateToYYYYMMDD(dateAsString: string): string | null {
    const [day, month, year] = dateAsString.split('/')
    if (day && month && year) return `${year}-${month}-${day}`
    else return null
  }
}

