// Angular Imports
import { ValidationErrors } from '@angular/forms'
// This Component Imports
import { InputErrorComponent } from './input-error.component'
// Thirdparty Imports
import { Spectator, createComponentFactory } from '@ngneat/spectator/jest'

describe('InputErrorComponent', () => {
  let spectator: Spectator<InputErrorComponent>
  const createComponent = createComponentFactory({
    component: InputErrorComponent,
    imports: [],
  })

  beforeEach(() => {
    spectator = createComponent({
      props: {
        errors: {} as ValidationErrors,
      },
    })
  })

  test('should render the component when created', () => {
    expect(spectator).toBeTruthy()
  })
})
