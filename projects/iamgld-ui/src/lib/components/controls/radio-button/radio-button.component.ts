// Angular Imports
import { ChangeDetectionStrategy, Component, computed, input, output, signal } from '@angular/core'
// Shared Imports
import { InputValue } from '../../../models'

@Component({
  selector: 'gld-radio-button',
  standalone: true,
  imports: [],
  templateUrl: './radio-button.component.html',
  styleUrl: './radio-button.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RadioButtonComponent {
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
