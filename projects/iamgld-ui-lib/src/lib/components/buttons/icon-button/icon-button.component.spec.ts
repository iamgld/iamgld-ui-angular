// This Component Imports
import { IconButtonComponent } from './icon-button.component'
// This Module Imports
import { IconComponent } from '../../icon/icon.component'
// Thirdparty Imports
import { Icons } from '@ui/models'
import { Spectator, createComponentFactory } from '@ngneat/spectator/jest'

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
