// Angular Imports
import { ChangeDetectionStrategy, Component, booleanAttribute, input, output } from '@angular/core'

@Component({
  selector: 'gld-button',
  templateUrl: './button.component.html',
  styleUrl: './button.component.scss',
  imports: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ButtonComponent {
  name = input.required<string>()
  disable = input<boolean, string | boolean>(false, { transform: booleanAttribute })
  // hasIcon = input<boolean, string | boolean>(false, { transform: booleanAttribute })
  // icon = input<Icons>(Icons.addLine)
  // iconSize = input<keyof typeof IconsSize>(IconsSize.small)
  // iconMoveTopToBottom = input<number, string | number>(0, { transform: numberAttribute })
  // iconMoveLeftToRight = input<number, string | number>(0, { transform: numberAttribute })
  color = input<ButtonColor>('pink')
  size = input<ButtonSize>('normal')
  clicked = output<void>()

  emitClick() {
    if (!this.disable()) this.clicked.emit()
  }
}

export type ButtonColor = 'pink' | 'purple' | 'mustard' | 'orange' | 'red' | 'blue' | 'green'
export type ButtonSize = 'tiny' | 'small' | 'normal' | 'medium' | 'large'
