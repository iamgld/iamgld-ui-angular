// Angular Imports

import { NgTemplateOutlet } from '@angular/common'
import {
  AfterContentInit,
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  contentChildren,
  effect,
  input,
  numberAttribute,
  output,
} from '@angular/core'
import { DropdownMenuTemplate } from '../../../directives'
import {
  BUTTON_COLORS,
  ButtonColor,
  BUTTON_SIZES,
  ButtonSize,
  DROPDOWN_DIRECTIONS,
  DropdownDirection,
  DROPDOWN_TYPES,
  DropdownType,
  Icons,
  ICONS_SIZES,
  IconsSize,
} from '../../../models'
// This Component Imports
import { Button } from '../button/button.component'
import { DropdownButton } from '../dropdown-button/dropdown-button.component'
import { IconButton } from '../icon-button/icon-button.component'

const components = [Button, IconButton]
const directives = [DropdownMenuTemplate]

@Component({
  selector: 'gld-dropdown-menu',
  imports: [NgTemplateOutlet, ...components, directives],
  templateUrl: './dropdown-menu.component.html',
  styleUrl: './dropdown-menu.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DropdownMenu implements AfterContentInit {
  readonly DROPDOWN_TYPES = DROPDOWN_TYPES

  id = input.required<string, string>({
    transform: (value: string) => `dropdown-id-${value.trim().split(' ').join('-')}`,
  })
  name = input.required<string, string>({
    transform: (value: string) => `dropdown-name-${value.trim().split(' ').join('-')}`,
  })
  type = input.required<DropdownType>()
  color = input<ButtonColor>(BUTTON_COLORS.pink)
  size = input<ButtonSize>(BUTTON_SIZES.normal)
  icon = input<Icons | null>(null)
  iconSize = input<IconsSize>(ICONS_SIZES.normal)
  moveTopToBottom = input<number, string | number>(0, { transform: numberAttribute })
  moveLeftToRight = input<number, string | number>(0, { transform: numberAttribute })
  disabled = input<boolean, string | boolean>(false, { transform: booleanAttribute })
  full = input<boolean, string | boolean>(false, { transform: booleanAttribute })
  direction = input<DropdownDirection>(DROPDOWN_DIRECTIONS.right)
  background = input<boolean, boolean | string>(false, { transform: booleanAttribute })
  selected = input<boolean, boolean | string>(false, { transform: booleanAttribute })
  initialValue = input<unknown>(null)
  changeValue = output<unknown>()
  changeFocus = output<boolean>()

  dropdownButtonChildren = contentChildren<DropdownButton>(DropdownButton)

  constructor() {
    effect(() => {
      const initialValue = this.initialValue()
      if (initialValue) this.updateCurrentInChildren(initialValue)
    })
  }

  ngAfterContentInit(): void {
    this.dropdownButtonChildren().map((dropdownButton: DropdownButton) => {
      dropdownButton.changeValue.subscribe((value) => this.updateCurrentInChildren(value))
    })
  }

  updateCurrentInChildren(value: unknown) {
    this.dropdownButtonChildren().map((dropdownButton: DropdownButton, index: number) => {
      if (this.selected()) dropdownButton.current.set(value)
      // Set current one time
      if (index === 0) this.changeValue.emit(value)
    })
  }

  updateErrorInChildren(error: boolean) {
    this.dropdownButtonChildren().map((dropdownButton: DropdownButton) =>
      dropdownButton.error.set(error),
    )
  }
}
