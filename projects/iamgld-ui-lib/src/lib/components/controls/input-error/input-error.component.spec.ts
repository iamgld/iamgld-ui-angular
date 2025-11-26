// Angular Imports
import { ValidationErrors } from '@angular/forms'
// Thirdparty Imports
import { createComponentFactory, Spectator } from '@ngneat/spectator/jest'
// This Component Imports
import { InputErrorComponent } from './input-error.component'

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
