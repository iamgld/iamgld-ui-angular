// This Component Imports
import { ButtonComponent } from './button.component'
// This Module Imports
import { IconComponent } from '../../icon/icon.component'
// Thirdparty Imports
import { Spectator, createComponentFactory } from '@ngneat/spectator/jest'

describe('ButtonComponent', () => {
  let spectator: Spectator<ButtonComponent>
  const createComponent = createComponentFactory({
    component: ButtonComponent,
    imports: [IconComponent],
  })

  beforeEach(() => {
    spectator = createComponent({
      props: {
        name: 'button',
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
    spectator.click('button')
    expect(emitSpy).toHaveBeenCalled()
  })

  test('should not emit clicked when disabled is true', () => {
    spectator.setInput('disabled', true)
    spectator.detectChanges()
    const emitSpy = jest.spyOn(spectator.component.clicked, 'emit')
    spectator.click('button')
    expect(emitSpy).not.toHaveBeenCalled()
  })

  test('should have correct classes for color and size', () => {
    spectator.setInput('color', 'purple')
    spectator.setInput('size', 'large')
    spectator.detectChanges()
    const button = spectator.query('button')
    expect(button?.classList.contains('button--purple')).toBe(true)
    expect(button?.classList.contains('button--large')).toBe(true)
  })

  test('should add icon when icon input is set', () => {
    spectator.setInput('icon', 'arrowDownSLine')
    spectator.detectChanges()
    const icon = spectator.query('gld-icon')
    expect(icon).not.toBeNull()
  })

  test('should remove icon when icon input is not set', () => {
    spectator.setInput('icon', null)
    spectator.detectChanges()
    const icon = spectator.query('gld-icon')
    expect(icon).toBeNull()
  })

  test('should add class "button--disabled" when disabled is true', () => {
    spectator.setInput('disabled', true)
    spectator.detectChanges()
    const button = spectator.query('button')
    expect(button?.classList.contains('button--disabled')).toBe(true)
  })

  test('should remove class "button--disabled" when disabled is false', () => {
    spectator.setInput('disabled', false)
    spectator.detectChanges()
    const button = spectator.query('button')
    expect(button?.classList.contains('button--disabled')).toBe(false)
  })

  test('should add class "button--full" when full is true', () => {
    spectator.setInput('full', true)
    spectator.detectChanges()
    const button = spectator.query('button')
    expect(button?.classList.contains('button--full')).toBe(true)
  })

  test('should remove class "button--full" when full is true', () => {
    spectator.setInput('full', true)
    spectator.detectChanges()
    const button = spectator.query('button')
    expect(button?.classList.contains('button--full')).toBe(true)
  })

  test('should emit clicked on keyup.enter', () => {
    const emitSpy = jest.spyOn(spectator.component, 'emitClick')
    spectator.dispatchKeyboardEvent('button', 'keyup', 'Enter')
    expect(emitSpy).toHaveBeenCalled()
  })
})
