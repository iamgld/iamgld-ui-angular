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
import {
  ReactiveFormsModule,
  ControlValueAccessor,
  NG_VALUE_ACCESSOR,
  FormControl,
} from '@angular/forms'
import { NgTemplateOutlet } from '@angular/common'
import { takeUntilDestroyed } from '@angular/core/rxjs-interop'
// This Module Imports
import { InputType } from '../../../models'
import { InputErrorComponent } from '../input-error/input-error.component'
// Shared Imports
import { debounceTime } from 'rxjs'

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
export class InputComponent implements ControlValueAccessor, OnInit {
  readonly #destroyRef = inject(DestroyRef)
  readonly #changeDetectorRef = inject(ChangeDetectorRef)

  control = input.required<FormControl<unknown>>()
  name = input.required<string>()
  label = input<string>('')
  placeholder = input<string>('')
  type = input<InputType>('text')
  suffix = input<boolean, boolean | string>(false, { transform: booleanAttribute })

  innerControl = signal(new FormControl<unknown>(''))

  // eslint-disable-next-line @typescript-eslint/no-empty-function, @typescript-eslint/no-unused-vars
  onChange = (value: unknown) => {}
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  onTouched = () => {}

  constructor() {
    this.innerControl()
      .valueChanges.pipe(takeUntilDestroyed(this.#destroyRef), debounceTime(100))
      .subscribe((value) => {
        const valueTransformed = value
        this.onChange(valueTransformed)
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

  onFocus() {
    // this.isMenuOpen.set(true)
  }

  onBlur() {
    this.onTouched()
    // this.isMenuOpen.set(false)
  }
}
