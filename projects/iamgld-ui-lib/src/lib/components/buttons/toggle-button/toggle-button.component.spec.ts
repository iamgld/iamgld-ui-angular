// This Component Imports

// Thirdparty Imports
import { createComponentFactory, Spectator } from '@ngneat/spectator/jest'
import { ToggleButtonComponent } from './toggle-button.component'

describe('ToggleButtonComponent', () => {
  let spectator: Spectator<ToggleButtonComponent>
  const createComponent = createComponentFactory({
    component: ToggleButtonComponent,
    imports: [],
  })

  beforeEach(() => {
    spectator = createComponent({
      props: {
        value: 'value',
      },
    })
  })

  test('should render the component when created', () => {
    expect(spectator).toBeTruthy()
  })
})
