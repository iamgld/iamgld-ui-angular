// This Component Imports
import { DropdownButtonComponent } from './dropdown-button.component'
// This Module Imports
import { IconComponent } from '../../icon/icon.component'
// Thirdparty Imports
import { Spectator, createComponentFactory } from '@ngneat/spectator/jest'

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
