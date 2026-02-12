// Angular Imports
import {
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  input,
  numberAttribute,
  output,
} from '@angular/core'
import { BUTTON_COLORS, ButtonColor, Icons, ICONS_SIZES, IconsSize, ICONS_SPACES, IconsSpace } from '../../../models'
// This Module Imports
import { Icon } from '../../icon/icon.component'

@Component({
  selector: 'gld-icon-button',
  templateUrl: './icon-button.html',
  styleUrl: './icon-button.scss',
  imports: [Icon],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IconButton {
  icon = input.required<Icons>()
  id = input.required<string, string>({
    transform: (value: string) => `button-id-${value.trim().split(' ').join('-')}`,
  })
  name = input.required<string, string>({
    transform: (value: string) => `button-name-${value.trim().split(' ').join('-')}`,
  })
  iconSize = input<IconsSize>(ICONS_SIZES.normal)
  space = input<IconsSpace>(ICONS_SPACES.none)
  moveTopToBottom = input<number, string | number>(0, { transform: numberAttribute })
  moveLeftToRight = input<number, string | number>(0, { transform: numberAttribute })
  background = input<boolean, boolean | string>(false, { transform: booleanAttribute })
  disabled = input<boolean, string | boolean>(false, { transform: booleanAttribute })
  color = input<ButtonColor>(BUTTON_COLORS.pink)
  clicked = output<void>()

  emitClick() {
    if (!this.disabled()) this.clicked.emit()
  }

  keyup() {
    this.emitClick()
  }
}
