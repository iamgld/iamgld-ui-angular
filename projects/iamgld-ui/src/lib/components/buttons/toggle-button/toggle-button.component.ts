// Angular Imports
import { ChangeDetectionStrategy, Component, computed, input, output, signal } from '@angular/core'
// This Module Imports
import { InputValue } from '../../../models'

@Component({
  selector: 'gld-toggle-button',
  imports: [],
  templateUrl: './toggle-button.component.html',
  styleUrl: './toggle-button.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ToggleButtonComponent {
  value = input.required<InputValue>()
  changeValue = output<InputValue>()
  changeFocus = output<boolean>()

  current = signal<InputValue>(null)
  disabled = signal<boolean>(false)
  error = signal<boolean>(false)
  selected = computed(() => Boolean(this.current() === this.value()))

  select(value: InputValue) {
    this.changeValue.emit(value)
  }

  keyup(value: InputValue) {
    this.select(value)
  }

  onFocus() {
    this.changeFocus.emit(true)
  }

  onBlur() {
    this.changeFocus.emit(false)
  }
}

