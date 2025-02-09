// Angular Imports
import {
  ChangeDetectionStrategy,
  Component,
  booleanAttribute,
  input,
  numberAttribute,
  output,
} from '@angular/core'
// This Module Imports
import { ButtonColor, ButtonSize, Icons, IconsSize } from '../../../models'
import { IconComponent } from '../../icon/icon.component'

const components = [IconComponent]

@Component({
  selector: 'gld-button',
  imports: [...components],
  templateUrl: './button.component.html',
  styleUrl: './button.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ButtonComponent {
  name = input.required<string>()
  color = input<keyof typeof ButtonColor>(ButtonColor.pink)
  size = input<keyof typeof ButtonSize>(ButtonSize.normal)
  icon = input<Icons | null>(null)
  iconSize = input<keyof typeof IconsSize>()
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
