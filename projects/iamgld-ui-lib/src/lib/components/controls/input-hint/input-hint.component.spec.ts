// This Component Imports

// Thirdparty Imports
import { createComponentFactory, Spectator } from '@ngneat/spectator/jest'
import { InputHintComponent } from './input-hint.component'

describe('InputHintComponent', () => {
  let spectator: Spectator<InputHintComponent>
  const createComponent = createComponentFactory({
    component: InputHintComponent,
    imports: [],
  })

  beforeEach(() => {
    spectator = createComponent({
      props: {},
    })
  })

  test('should render the component when created', () => {
    expect(spectator).toBeTruthy()
  })
})
