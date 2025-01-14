// Angular Imports
import { ChangeDetectionStrategy, Component, booleanAttribute, input, output } from '@angular/core'
// This Module Imports
import { ButtonColor, ButtonSize } from '../../../models'

@Component({
  selector: 'gld-button',
  templateUrl: './button.component.html',
  styleUrl: './button.component.scss',
  imports: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ButtonComponent {
  name = input.required<string>()
  disabled = input<boolean, string | boolean>(false, { transform: booleanAttribute })
  // hasIcon = input<boolean, string | boolean>(false, { transform: booleanAttribute })
  // icon = input<Icons>(Icons.addLine)
  // iconSize = input<keyof typeof IconsSize>(IconsSize.small)
  // iconMoveTopToBottom = input<number, string | number>(0, { transform: numberAttribute })
  // iconMoveLeftToRight = input<number, string | number>(0, { transform: numberAttribute })
  color = input<ButtonColor>('pink')
  size = input<ButtonSize>('normal')
  clicked = output<void>()

  emitClick() {
    if (!this.disabled()) this.clicked.emit()
  }
}
