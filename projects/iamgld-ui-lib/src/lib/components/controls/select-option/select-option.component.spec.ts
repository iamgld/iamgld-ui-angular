// This Component Imports
import { SelectOptionComponent } from './select-option.component'
// Thirdparty Imports
import { Spectator, createComponentFactory } from '@ngneat/spectator/jest'

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
