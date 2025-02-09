// Angular Imports
import {
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  contentChildren,
  input,
  numberAttribute,
  output,
  AfterContentInit,
  effect,
} from '@angular/core'
import { NgTemplateOutlet } from '@angular/common'
// This Component Imports
import {
  ButtonColor,
  ButtonSize,
  Icons,
  IconsSize,
  DropdownType,
  DropdownDirection,
} from '../../../models'
import { DropdownMenuTemplateDirective } from '../../../directives'
import { ButtonComponent } from '../button/button.component'
import { IconButtonComponent } from '../icon-button/icon-button.component'
import { DropdownButtonComponent } from '../dropdown-button/dropdown-button.component'

const components = [ButtonComponent, IconButtonComponent]
const directives = [DropdownMenuTemplateDirective]

@Component({
  selector: 'gld-dropdown-menu',
  imports: [NgTemplateOutlet, ...components, directives],
  templateUrl: './dropdown-menu.component.html',
  styleUrl: './dropdown-menu.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DropdownMenuComponent implements AfterContentInit {
  readonly DropdownType = DropdownType

  name = input.required<string>()
  type = input.required<keyof typeof DropdownType>()
  color = input<keyof typeof ButtonColor>(ButtonColor.pink)
  size = input<keyof typeof ButtonSize>(ButtonSize.normal)
  icon = input<Icons | null>(null)
  iconSize = input<keyof typeof IconsSize>()
  moveTopToBottom = input<number, string | number>(0, { transform: numberAttribute })
  moveLeftToRight = input<number, string | number>(0, { transform: numberAttribute })
  disabled = input<boolean, string | boolean>(false, { transform: booleanAttribute })
  full = input<boolean, string | boolean>(false, { transform: booleanAttribute })
  direction = input<keyof typeof DropdownDirection>(DropdownDirection.left)
  background = input<boolean, boolean | string>(false, { transform: booleanAttribute })
  initialValue = input<unknown>(null)
  changeValue = output<unknown>()
  changeFocus = output<boolean>()

  dropdownButtonChildren = contentChildren<DropdownButtonComponent>(DropdownButtonComponent)

  constructor() {
    effect(() => {
      const initialValue = this.initialValue()
      if (initialValue) this.updateCurrentInChildren(initialValue)
    })
  }

  ngAfterContentInit(): void {
    this.dropdownButtonChildren().map((dropdownButton: DropdownButtonComponent) => {
      dropdownButton.changeValue.subscribe((value) => this.updateCurrentInChildren(value))
    })
  }

  updateCurrentInChildren(value: unknown) {
    this.dropdownButtonChildren().map((dropdownButton: DropdownButtonComponent, index: number) => {
      dropdownButton.current.set(value)
      // Set current one time
      if (index === 0) this.changeValue.emit(value)
    })
  }

  updateErrorInChildren(error: boolean) {
    this.dropdownButtonChildren().map((dropdownButton: DropdownButtonComponent) =>
      dropdownButton.error.set(error),
    )
  }
}

