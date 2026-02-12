// Angular Imports
import {
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  input,
  numberAttribute,
  output,
} from '@angular/core'
import { BUTTON_COLORS, ButtonColor, BUTTON_SIZES, ButtonSize, Icons, ICONS_SIZES, IconsSize } from '../../../models'
// This Module Imports
import { Icon } from '../../icon/icon.component'

@Component({
  selector: 'gld-button',
  imports: [Icon],
  templateUrl: './button.html',
  styleUrl: './button.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Button {
  id = input.required<string, string>({
    transform: (value: string) => `button-id-${value.trim().split(' ').join('-')}`,
  })
  name = input.required<string, string>({
    transform: (value: string) => `button-name-${value.trim().split(' ').join('-')}`,
  })
  color = input<ButtonColor>(BUTTON_COLORS.pink)
  size = input<ButtonSize>(BUTTON_SIZES.normal)
  icon = input<Icons | null>(null)
  iconSize = input<IconsSize>(ICONS_SIZES.normal)
  moveTopToBottom = input<number, string | number>(0, { transform: numberAttribute })
  moveLeftToRight = input<number, string | number>(0, { transform: numberAttribute })
  disabled = input<boolean, string | boolean>(false, { transform: booleanAttribute })
  full = input<boolean, string | boolean>(false, { transform: booleanAttribute })
  clicked = output<void>()

  emitClick() {
    if (!this.disabled()) this.clicked.emit()
  }

  keyup() {
    this.emitClick()
  }
}
