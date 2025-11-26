// Angular Imports
import { NgTemplateOutlet } from '@angular/common'
import { FormControl, NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms'
// This Component Imports
import { TextareaComponent } from './textarea.component'
import { InputErrorComponent } from '../input-error/input-error.component'
// Thirdparty Imports
import { Spectator, createComponentFactory } from '@ngneat/spectator/jest'
import { forwardRef } from '@angular/core'

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
