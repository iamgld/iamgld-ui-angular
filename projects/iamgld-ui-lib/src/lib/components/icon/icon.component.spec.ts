// This Component Imports

// Thirdparty Imports
import { createComponentFactory, Spectator } from '@ngneat/spectator/jest'
import { Icons } from '../../models'
import { IconComponent } from './icon.component'

describe('IconComponent', () => {
  let spectator: Spectator<IconComponent>
  const createComponent = createComponentFactory({
    component: IconComponent,
    imports: [],
  })

  beforeEach(() => {
    spectator = createComponent({
      props: {
        icon: Icons.arrowDownSLine,
        disabled: false,
      },
    })
  })

  test('should render the component when created', () => {
    expect(spectator).toBeTruthy()
  })

  test('should emit clicked when disabled is false', () => {
    spectator.setInput('disabled', false)
    spectator.detectChanges()
    const emitSpy = jest.spyOn(spectator.component.clicked, 'emit')
    spectator.click('span')
    expect(emitSpy).toHaveBeenCalled()
  })

  test('should not emit clicked when disabled is true', () => {
    spectator.setInput('disabled', true)
    spectator.detectChanges()
    const emitSpy = jest.spyOn(spectator.component.clicked, 'emit')
    spectator.click('span')
    expect(emitSpy).not.toHaveBeenCalled()
  })

  test('should emit clicked on keyup.enter', () => {
    const emitSpy = jest.spyOn(spectator.component, 'emitClick')
    spectator.dispatchKeyboardEvent('span', 'keyup', 'Enter')
    expect(emitSpy).toHaveBeenCalled()
  })
})
