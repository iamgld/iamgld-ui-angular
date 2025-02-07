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
import { ControlValueAccessor, FormControl, NG_VALUE_ACCESSOR } from '@angular/forms'
import { takeUntilDestroyed } from '@angular/core/rxjs-interop'
// This Module Imports
import { InputValue } from '../../../models'
import { ToggleButtonComponent } from './../toggle-button/toggle-button.component'

@Component({
  selector: 'gld-toggle-group',
  imports: [],
  templateUrl: './toggle-group.component.html',
  styleUrl: './toggle-group.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => ToggleGroupComponent),
      multi: true,
    },
  ],
})
export class ToggleGroupComponent implements ControlValueAccessor, OnInit, AfterContentInit {
  readonly #destroyRef = inject(DestroyRef)
  readonly #changeDetectorRef = inject(ChangeDetectorRef)

  control = input.required<FormControl<InputValue>>()
  name = input.required<string>()

  toggleButtonChildren = contentChildren<ToggleButtonComponent>(ToggleButtonComponent)
  innerControl = signal(new FormControl<InputValue>('', { nonNullable: true }))

  // eslint-disable-next-line @typescript-eslint/no-empty-function, @typescript-eslint/no-unused-vars
  onChange = (value: InputValue) => {}
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
      .events.pipe(takeUntilDestroyed(this.#destroyRef))
      .subscribe(() => {
        this.updateErrorInChildren(
          this.control().invalid && (this.control().dirty || this.control().touched),
        )
        this.#changeDetectorRef.detectChanges()
      })
  }

  ngAfterContentInit(): void {
    this.toggleButtonChildren().map((toggleButton: ToggleButtonComponent) => {
      toggleButton.changeValue.subscribe((value) => this.updateCurrentInChildren(value))
      toggleButton.changeFocus.subscribe((focus) => {
        if (!focus) this.onTouched()
      })
    })
  }

  updateCurrentInChildren(value: InputValue) {
    this.toggleButtonChildren().map((toggleButton: ToggleButtonComponent, index: number) => {
      toggleButton.current.set(value)
      // Set current one time
      if (index === 0) this.onChange(value)
    })
  }

  updateErrorInChildren(error: boolean) {
    this.toggleButtonChildren().map((toggleButton: ToggleButtonComponent) =>
      toggleButton.error.set(error),
    )
  }

  writeValue(value: InputValue): void {
    // console.log('writeValue')
    if (value !== this.innerControl().value) {
      this.innerControl().setValue(value)
    }
  }

  registerOnChange(onChange: (value: InputValue) => void): void {
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
    this.toggleButtonChildren().map((toggleButton: ToggleButtonComponent) =>
      toggleButton.disabled.set(disabled),
    )
  }
}

