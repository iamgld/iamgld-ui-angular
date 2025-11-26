// Angular Imports
import { NgTemplateOutlet } from '@angular/common'
import { forwardRef } from '@angular/core'
import { FormControl, NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms'
// Thirdparty Imports
import { createComponentFactory, Spectator } from '@ngneat/spectator/jest'
import { InputErrorComponent } from '../input-error/input-error.component'
// This Component Imports
import { TextareaComponent } from './textarea.component'

const components = [InputErrorComponent]

describe('TextareaComponent', () => {
  let spectator: Spectator<TextareaComponent>
  const createComponent = createComponentFactory({
    component: TextareaComponent,
    imports: [ReactiveFormsModule, NgTemplateOutlet, ...components],
    providers: [
      {
        provide: NG_VALUE_ACCESSOR,
        useExisting: forwardRef(() => TextareaComponent),
        multi: true,
      },
    ],
  })

  beforeEach(() => {
    spectator = createComponent({
      props: {
        control: new FormControl(),
        name: 'textarea',
      },
    })
  })

  test('should render the component when created', () => {
    expect(spectator).toBeTruthy()
  })
})
