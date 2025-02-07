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
import { InputValue } from '../../../models'
import { ToggleButtonComponent } from './../toggle-button/toggle-button.component'

@Component({
  selector: 'gld-toggle-group',
  imports: [],
  templateUrl: './toggle-group.component.html',
  styleUrl: './toggle-group.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ToggleGroupComponent implements AfterContentInit {
  name = input.required<string>()
  initialValue = input<InputValue>(null)
  changeValue = output<InputValue>()
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
      // toggleButton.changeFocus.subscribe((focus) => {
      //   if (!focus) this.changeFocus.emit(focus)
      // })
    })
  }

  updateCurrentInChildren(value: InputValue) {
    this.toggleButtonChildren().map((toggleButton: ToggleButtonComponent, index: number) => {
      toggleButton.current.set(value)
      // Set current one time
      if (index === 0) {
        this.changeValue.emit(value)
      }
    })
  }

  updateErrorInChildren(error: boolean) {
    this.toggleButtonChildren().map((toggleButton: ToggleButtonComponent) =>
      toggleButton.error.set(error),
    )
  }

  setDisabledState(disabled: boolean): void {
    // console.log('setDisabledState')
    this.#updateDisabledInChildren(disabled)
  }

  #updateDisabledInChildren(disabled: boolean) {
    this.toggleButtonChildren().map((toggleButton: ToggleButtonComponent) =>
      toggleButton.disabled.set(disabled),
    )
  }
}

