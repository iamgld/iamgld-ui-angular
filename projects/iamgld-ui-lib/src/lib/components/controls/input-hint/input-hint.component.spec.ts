// This Component Imports
import { InputHintComponent } from './input-hint.component'
// Thirdparty Imports
import { Spectator, createComponentFactory } from '@ngneat/spectator/jest'

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
