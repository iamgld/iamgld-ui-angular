// This Component Imports
import { RadioButtonComponent } from './radio-button.component'
// Thirdparty Imports
import { Spectator, createComponentFactory } from '@ngneat/spectator/jest'

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
