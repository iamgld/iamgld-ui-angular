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
  color = input<ButtonColor>('pink')
  size = input<ButtonSize>('normal')
  disabled = input<boolean, string | boolean>(false, { transform: booleanAttribute })
  clicked = output<void>()

  emitClick() {
    if (!this.disabled()) this.clicked.emit()
  }

  keyup() {
    this.emitClick()
  }
}
