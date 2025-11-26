// This Component Imports

// Thirdparty Imports
import { createComponentFactory, Spectator } from '@ngneat/spectator/jest'
import { RadioButtonComponent } from './radio-button.component'

describe('RadioButtonComponent', () => {
  let spectator: Spectator<RadioButtonComponent>
  const createComponent = createComponentFactory({
    component: RadioButtonComponent,
    imports: [],
  })

  beforeEach(() => {
    spectator = createComponent({
      props: {
        value: 'radio-button',
      },
    })
  })

  test('should render the component when created', () => {
    expect(spectator).toBeTruthy()
  })
})
