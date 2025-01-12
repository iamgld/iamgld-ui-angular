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
import { Icons, InputValue } from '../../../models'
// Shared Imports
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
  name = input.required<string>()
  label = input<string>('')
  placeholder = input<string>('')
  transform = input<(value: unknown) => string>((value: unknown) => String(value))

  selectElement = viewChild<ElementRef<HTMLElement>>('selectElement')
  selectOptionChildren = contentChildren<SelectOptionComponent>(SelectOptionComponent)

  innerControl = signal(new FormControl<unknown>(''))
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
      .valueChanges.pipe(takeUntilDestroyed(this.#destroyRef), debounceTime(100))
      .subscribe((value) => this.onChange(value))
  }

  ngOnInit(): void {
    // Subscribes to the form control's events and triggers change detection to update the view accordingly.
    this.control()
      .events.pipe(takeUntilDestroyed(this.#destroyRef), debounceTime(100))
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
}
