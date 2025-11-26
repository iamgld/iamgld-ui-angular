// This Component Imports

// Thirdparty Imports
import { createComponentFactory, Spectator } from '@ngneat/spectator/jest'
import { Icons } from '../../../models'
// This Module Imports
import { IconComponent } from '../../icon/icon.component'
import { IconButtonComponent } from './icon-button.component'

describe('IconButtonComponent', () => {
  let spectator: Spectator<IconButtonComponent>
  const createComponent = createComponentFactory({
    component: IconButtonComponent,
    imports: [IconComponent],
  })

  beforeEach(() => {
    spectator = createComponent({
      props: {
        icon: Icons.arrowDownSLine,
        name: 'arrow down line',
      },
    })
  })

  test('should render the component when created', () => {
    expect(spectator).toBeTruthy()
  })
})
