// This Component Imports
import { ToggleGroupComponent } from './toggle-group.component'
// Thirdparty Imports
import { Spectator, createComponentFactory } from '@ngneat/spectator/jest'

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
