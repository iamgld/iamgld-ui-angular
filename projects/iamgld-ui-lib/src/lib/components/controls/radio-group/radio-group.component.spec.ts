// Angular Imports
import { NgTemplateOutlet } from '@angular/common'
import { FormControl, NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms'
// This Component Imports
import { RadioGroupComponent } from './radio-group.component'
import { InputErrorComponent } from '../input-error/input-error.component'
// Thirdparty Imports
import { Spectator, createComponentFactory } from '@ngneat/spectator/jest'
import { forwardRef } from '@angular/core'

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
