// Angular Imports
import {
  AfterContentInit,
  ChangeDetectionStrategy,
  Component,
  contentChildren,
  effect,
  input,
  output,
} from '@angular/core'
// This Module Imports
import { ToggleButtonComponent } from '../toggle-button/toggle-button.component'

@Component({
  selector: 'gld-toggle-group',
  imports: [],
  templateUrl: './toggle-group.component.html',
  styleUrl: './toggle-group.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ToggleGroupComponent implements AfterContentInit {
  id = input.required<string, string>({
    transform: (value: string) => `toggle-id-${value.trim().split(' ').join('-')}`,
  })
  name = input.required<string, string>({
    transform: (value: string) => `toggle-name-${value.trim().split(' ').join('-')}`,
  })
  initialValue = input<unknown>(null)
  changeValue = output<unknown>()
  changeFocus = output<boolean>()

  toggleButtonChildren = contentChildren<ToggleButtonComponent>(ToggleButtonComponent)

  constructor() {
    effect(() => {
      const initialValue = this.initialValue()
      if (initialValue) this.updateCurrentInChildren(initialValue)
    })
  }

  ngAfterContentInit(): void {
    this.toggleButtonChildren().map((toggleButton: ToggleButtonComponent) => {
      toggleButton.changeValue.subscribe((value) => this.updateCurrentInChildren(value))
    })
  }

  updateCurrentInChildren(value: unknown) {
    this.toggleButtonChildren().map((toggleButton: ToggleButtonComponent, index: number) => {
      toggleButton.current.set(value)
      // Set current one time
      if (index === 0) this.changeValue.emit(value)
    })
  }

  updateErrorInChildren(error: boolean) {
    this.toggleButtonChildren().map((toggleButton: ToggleButtonComponent) =>
      toggleButton.error.set(error),
    )
  }
}
