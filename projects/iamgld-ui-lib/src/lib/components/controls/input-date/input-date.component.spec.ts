// Angular Imports

import { NgTemplateOutlet } from '@angular/common'
import { forwardRef } from '@angular/core'
import { FormControl, NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms'
// Thirdparty Imports
import { createComponentFactory, Spectator } from '@ngneat/spectator/jest'
// This Module Imports
import { InputErrorComponent } from '../input-error/input-error.component'
// This Component Imports
import { InputDateComponent } from './input-date.component'

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
