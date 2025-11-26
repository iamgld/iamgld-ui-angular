// This Component Imports

// Thirdparty Imports
import { createComponentFactory, Spectator } from '@ngneat/spectator/jest'
// This Module Imports
import { IconComponent } from '../../icon/icon.component'
import { DropdownButtonComponent } from './dropdown-button.component'

describe('DropdownButtonComponent', () => {
  let spectator: Spectator<DropdownButtonComponent>
  const createComponent = createComponentFactory({
    component: DropdownButtonComponent,
    imports: [IconComponent],
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
