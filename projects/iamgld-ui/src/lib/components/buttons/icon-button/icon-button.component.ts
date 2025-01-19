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
import { ButtonColor, Icons, IconsSize, IconsSpace } from '../../../models'
import { IconComponent } from '../../icon/icon.component'

@Component({
  selector: 'gld-icon-button',
  templateUrl: './icon-button.component.html',
  styleUrl: './icon-button.component.scss',
  imports: [IconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IconButtonComponent {
  icon = input.required<Icons>()
  name = input.required<string>()
  iconSize = input<keyof typeof IconsSize>(IconsSize.normal)
  space = input<keyof typeof IconsSpace>(IconsSpace.none)
  moveTopToBottom = input<number, string | number>(0, { transform: numberAttribute })
  moveLeftToRight = input<number, string | number>(0, { transform: numberAttribute })
  background = input<boolean, boolean | string>(false, { transform: booleanAttribute })
  disabled = input<boolean, string | boolean>(false, { transform: booleanAttribute })
  color = input<keyof typeof ButtonColor>(ButtonColor.pink)
  clicked = output<void>()

  emitClick() {
    if (!this.disabled()) this.clicked.emit()
  }

  keyup() {
    this.emitClick()
  }
}
