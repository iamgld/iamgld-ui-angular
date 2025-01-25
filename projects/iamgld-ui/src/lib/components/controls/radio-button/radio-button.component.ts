// Angular Imports
import { ChangeDetectionStrategy, Component, computed, input, output, signal } from '@angular/core'

@Component({
  selector: 'gld-radio-button',
  standalone: true,
  imports: [],
  templateUrl: './radio-button.component.html',
  styleUrl: './radio-button.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RadioButtonComponent {
  value = input.required<unknown>()
  changeValue = output<unknown>()
  changeFocus = output<boolean>()

  current = signal<unknown>(null)
  disabled = signal<boolean>(false)
  error = signal<boolean>(false)
  selected = computed(() => Boolean(this.current() === this.value()))

  select(value: unknown) {
    this.changeValue.emit(value)
  }

  keyup(value: unknown) {
    this.select(value)
  }

  onFocus() {
    this.changeFocus.emit(true)
  }

  onBlur() {
    this.changeFocus.emit(false)
  }
}
