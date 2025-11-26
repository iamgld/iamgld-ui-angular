// Angular Imports
import { NgTemplateOutlet } from '@angular/common'
import { forwardRef } from '@angular/core'
import { FormControl, NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms'
// Thirdparty Imports
import { createComponentFactory, Spectator } from '@ngneat/spectator/jest'
import { InputErrorComponent } from '../input-error/input-error.component'
// This Component Imports
import { RadioGroupComponent } from './radio-group.component'

const components = [InputErrorComponent]

describe('RadioGroupComponent', () => {
  let spectator: Spectator<RadioGroupComponent>
  const createComponent = createComponentFactory({
    component: RadioGroupComponent,
    imports: [ReactiveFormsModule, NgTemplateOutlet, ...components],
    providers: [
      {
        provide: NG_VALUE_ACCESSOR,
        useExisting: forwardRef(() => RadioGroupComponent),
        multi: true,
      },
    ],
  })

  beforeEach(() => {
    spectator = createComponent({
      props: {
        control: new FormControl(),
        name: 'radio-group',
      },
    })
  })

  test('should render the component when created', () => {
    expect(spectator).toBeTruthy()
  })
})
