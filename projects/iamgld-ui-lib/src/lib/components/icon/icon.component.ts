// Angular Imports
import {
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  input,
  numberAttribute,
  output,
} from '@angular/core'
// This Module Imports
import { ICONS, Icons, ICONS_SIZES, IconsSize, ICONS_SPACES, IconsSpace } from '../../models'

@Component({
  selector: 'gld-icon',
  standalone: true,
  imports: [],
  templateUrl: './icon.html',
  styleUrl: './icon.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Icon {
  readonly ICONS_SPACES = ICONS_SPACES
  readonly ICONS = ICONS

  icon = input.required<Icons>()
  size = input<IconsSize>(ICONS_SIZES.normal)
  space = input<IconsSpace>(ICONS_SPACES.none)
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
