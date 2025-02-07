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
import { ControlValueAccessor, NG_VALUE_ACCESSOR, FormControl } from '@angular/forms'
import { takeUntilDestroyed } from '@angular/core/rxjs-interop'
// This Module Imports
import { RadioDirection } from '../../../models'
import { RadioButtonComponent } from '../radio-button/radio-button.component'
import { InputErrorComponent } from '../input-error/input-error.component'
// Shared Imports
import { debounceTime } from 'rxjs'

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
export class RadioGroupComponent implements ControlValueAccessor, OnInit, AfterContentInit {
  readonly #destroyRef = inject(DestroyRef)
  readonly #changeDetectorRef = inject(ChangeDetectorRef)

  control = input.required<FormControl<unknown>>()
  name = input.required<string>()
  label = input<string>('')
  direction = input<keyof typeof RadioDirection>(RadioDirection.horizontal)

  radioButtonChildren = contentChildren<RadioButtonComponent>(RadioButtonComponent)
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
        if (value) this.updateCurrentInChildren(value)
      })
  }

  ngOnInit(): void {
    // Subscribes to the form control's events and triggers change detection to update the view accordingly.
    this.control()
      .events.pipe(takeUntilDestroyed(this.#destroyRef), debounceTime(100))
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
