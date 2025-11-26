// Angular Imports
import { FormControl, NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms'
import { NgTemplateOutlet } from '@angular/common'
import { forwardRef } from '@angular/core'
// This Component Imports
import { InputComponent } from './input.component'
// This Module Imports
import { InputErrorComponent } from '../input-error/input-error.component'
// Thirdparty Imports
import { Spectator, createComponentFactory } from '@ngneat/spectator/jest'

const components = [InputErrorComponent]

describe('InputComponent', () => {
  let spectator: Spectator<InputComponent>
  const createComponent = createComponentFactory({
    component: InputComponent,
    imports: [ReactiveFormsModule, NgTemplateOutlet, ...components],
    providers: [
      {
        provide: NG_VALUE_ACCESSOR,
        useExisting: forwardRef(() => InputComponent),
        multi: true,
      },
    ],
  })

  beforeEach(() => {
    spectator = createComponent({
      props: {
        control: new FormControl(),
        name: 'input',
        id: 'input',
      },
    })
  })

  test('should render the component when created', () => {
    expect(spectator).toBeTruthy()
  })
})
