// Angular Imports
import { NgTemplateOutlet } from '@angular/common'
import { forwardRef } from '@angular/core'
import { FormControl, NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms'
// Thirdparty Imports
import { createComponentFactory, Spectator } from '@ngneat/spectator/jest'
import { InputErrorComponent } from '../input-error/input-error.component'
// This Component Imports
import { SelectComponent } from './select.component'

const components = [InputErrorComponent]

describe('SelectComponent', () => {
  let spectator: Spectator<SelectComponent>
  const createComponent = createComponentFactory({
    component: SelectComponent,
    imports: [ReactiveFormsModule, NgTemplateOutlet, ...components],
    providers: [
      {
        provide: NG_VALUE_ACCESSOR,
        useExisting: forwardRef(() => SelectComponent),
        multi: true,
      },
    ],
  })

  beforeEach(() => {
    spectator = createComponent({
      props: {
        control: new FormControl(),
        name: 'select',
      },
    })
  })

  test('should render the component when created', () => {
    expect(spectator).toBeTruthy()
  })
})
