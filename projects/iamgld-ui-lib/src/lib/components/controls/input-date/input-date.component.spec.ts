// Angular Imports
import { FormControl, NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms'
import { NgTemplateOutlet } from '@angular/common'
import { forwardRef } from '@angular/core'
// This Component Imports
import { InputDateComponent } from './input-date.component'
// This Module Imports
import { InputErrorComponent } from '../input-error/input-error.component'
// Thirdparty Imports
import { Spectator, createComponentFactory } from '@ngneat/spectator/jest'

const components = [InputErrorComponent]

describe('InputDateComponent', () => {
  let spectator: Spectator<InputDateComponent>
  const createComponent = createComponentFactory({
    component: InputDateComponent,
    imports: [ReactiveFormsModule, NgTemplateOutlet, ...components],
    providers: [
      {
        provide: NG_VALUE_ACCESSOR,
        useExisting: forwardRef(() => InputDateComponent),
        multi: true,
      },
    ],
  })

  beforeEach(() => {
    spectator = createComponent({
      props: {
        control: new FormControl(),
        name: 'input',
      },
    })
  })

  test('should render the component when created', () => {
    expect(spectator).toBeTruthy()
  })
})
