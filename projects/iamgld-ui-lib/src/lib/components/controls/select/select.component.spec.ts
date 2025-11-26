// Angular Imports
import { NgTemplateOutlet } from '@angular/common'
import { FormControl, NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms'
// This Component Imports
import { SelectComponent } from './select.component'
import { InputErrorComponent } from '../input-error/input-error.component'
// Thirdparty Imports
import { Spectator, createComponentFactory } from '@ngneat/spectator/jest'
import { forwardRef } from '@angular/core'

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
