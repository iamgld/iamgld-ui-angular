// This Component Imports

// Thirdparty Imports
import { createComponentFactory, Spectator } from '@ngneat/spectator/jest'
import { SelectOptionComponent } from './select-option.component'

describe('SelectOptionComponent', () => {
  let spectator: Spectator<SelectOptionComponent>
  const createComponent = createComponentFactory({
    component: SelectOptionComponent,
    imports: [],
  })

  beforeEach(() => {
    spectator = createComponent({
      props: {
        value: 'select-option',
      },
    })
  })

  test('should render the component when created', () => {
    expect(spectator).toBeTruthy()
  })
})
