// Angular Imports
import { booleanAttribute, ChangeDetectionStrategy, Component, input, output } from '@angular/core'
// This Module Imports
import { InputValue } from '../../../models'

@Component({
  selector: 'gld-select-option',
  standalone: true,
  imports: [],
  templateUrl: './select-option.component.html',
  styleUrl: './select-option.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SelectOptionComponent {
  value = input.required<InputValue>()
  disabled = input<boolean, boolean | string>(false, { transform: booleanAttribute })
  selected = output<InputValue>()
  changeFocus = output<boolean>()

  select(): void {
    if (!this.disabled()) this.selected.emit(this.value())
  }

  keyup() {
    this.select()
  }

  onFocus() {
    this.changeFocus.emit(true)
  }

  onBlur() {
    this.changeFocus.emit(false)
  }
}
