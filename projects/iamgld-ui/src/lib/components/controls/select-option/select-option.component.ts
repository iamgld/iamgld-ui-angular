// Angular Imports
import { ChangeDetectionStrategy, Component, input, output } from '@angular/core'
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
  selected = output<InputValue>()

  select(): void {
    this.selected.emit(this.value())
  }

  keyup() {
    this.select()
  }
}
