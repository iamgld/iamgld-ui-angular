// This Component Imports
import { ToggleButtonComponent } from './toggle-button.component'
// Thirdparty Imports
import { Spectator, createComponentFactory } from '@ngneat/spectator/jest'

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
