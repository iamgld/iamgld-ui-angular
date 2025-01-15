// Angular Imports
import {
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  input,
  numberAttribute,
  output,
} from '@angular/core'
// Shared Imports
import { Icons, IconsSize, IconsSpace } from '../../models'

@Component({
  selector: 'gld-icon',
  standalone: true,
  imports: [],
  templateUrl: './icon.component.html',
  styleUrl: './icon.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IconComponent {
  readonly IconsSpace = IconsSpace
  readonly Icons = Icons

  icon = input.required<Icons>()
  size = input<keyof typeof IconsSize>(IconsSize.normal)
  space = input<keyof typeof IconsSpace>(IconsSpace.none)
  moveTopToBottom = input<number, string | number>(0, { transform: numberAttribute })
  moveLeftToRight = input<number, string | number>(0, { transform: numberAttribute })
  disabled = input<boolean, string | boolean>(false, { transform: booleanAttribute })
  clicked = output<void>()

  emitClick() {
    if (!this.disabled()) this.clicked.emit()
  }

  keyup() {
    this.emitClick()
  }
}
