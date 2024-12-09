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
} from '@angular/core'
import { NgTemplateOutlet } from '@angular/common'
import {
  ControlValueAccessor,
  NG_VALUE_ACCESSOR,
  ReactiveFormsModule,
  FormControl,
} from '@angular/forms'
// This Module Imports
import { IconComponent } from '../../icon/icon.component'
import { InputErrorComponent } from '../input-error/input-error.component'
import { SelectOptionComponent } from '../select-option/select-option.component'
import { Icons, InputValue, SelectType } from '../../../models'

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
export class SelectComponent implements ControlValueAccessor, AfterContentInit {
  readonly Icons = Icons

  control = input.required<FormControl<unknown>>()
  name = input.required<string>()
  label = input<string>('')
  placeholder = input<string>('')
  type = input<keyof typeof SelectType>(SelectType.default)
  transform = input<(value: unknown) => string>((value: unknown) => String(value))

  selectElement = viewChild<ElementRef>('selectElement')
  selectOptionElements = contentChildren<SelectOptionComponent>(SelectOptionComponent)

  // eslint-disable-next-line @typescript-eslint/no-empty-function, @typescript-eslint/no-unused-vars
  onChange = (value: unknown) => {}
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  onTouched = () => {}

  constructor() {
    effect(() => {
      if (this.selectOptionElements()) this.#detectSelectOptionElements()
    })

    effect(() => {
      // console.log(this.control())
      const currentValue = this.control().value
      if (this.control().dirty || this.control().touched) {
        const newValue = this.control().value
        if (newValue !== currentValue) this.onChange(newValue)
      }
    })
  }

  ngAfterContentInit(): void {
    this.#detectSelectOptionElements()
  }

  writeValue(value: unknown): void {
    // console.log('writeValue')
    if (value !== this.control().value) {
      const valueTransformed = this.#transformValue(value)
      this.control().setValue(valueTransformed, { emitEvent: false })
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

  #transformValue(value: unknown): string | null {
    let valueTransformed: string | null

    if (value === null || value === undefined) valueTransformed = null
    else valueTransformed = this.transform()(value)

    return valueTransformed
  }

  #detectSelectOptionElements() {
    const selectOptionElements = this.selectOptionElements()
    const selectElement: HTMLSelectElement | undefined = this.selectElement()?.nativeElement
    selectElement?.style.setProperty('--option-items', String(selectOptionElements.length))
    const clientHeight: number | undefined =
      selectElement?.querySelector('gld-select-option')?.clientHeight
    if (clientHeight) selectElement?.style.setProperty('--option-height', `${clientHeight}px`)

    selectOptionElements.map((selectOptionElement) => {
      selectOptionElement.selected.subscribe((value: InputValue) => {
        if (value) {
          const buttons = Array.from(
            selectElement?.querySelectorAll('gld-select-option button') ?? [],
          ) as HTMLButtonElement[]
          buttons.map((button) => button.blur())
          const valueTransformed = this.#transformValue(value)
          this.control().setValue(valueTransformed, { emitEvent: false })
          this.onChange(value)
          this.onTouched()
        }
      })
    })
  }
}
