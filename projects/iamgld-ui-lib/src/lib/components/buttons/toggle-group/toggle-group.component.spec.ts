// This Component Imports

// Thirdparty Imports
import { createComponentFactory, Spectator } from '@ngneat/spectator/jest'
import { ToggleGroupComponent } from './toggle-group.component'

describe('ToggleGroupComponent', () => {
  let spectator: Spectator<ToggleGroupComponent>
  const createComponent = createComponentFactory({
    component: ToggleGroupComponent,
    imports: [],
  })

  beforeEach(() => {
    spectator = createComponent({
      props: {
        name: 'toggle-group',
      },
    })
  })

  test('should render the component when created', () => {
    expect(spectator).toBeTruthy()
  })
})
