import { signal } from '@angular/core'
import { TestBed } from '@angular/core/testing'

import { DropdownButton } from './dropdown-button.component'

describe('DropdownButton', () => {
  const create = () => TestBed.runInInjectionContext(() => new DropdownButton())

  it('Given an output spy, When select and keyup are called, Then changeValue emits both values', () => {
    const component = create()
    const spy = vi.spyOn(component.changeValue, 'emit')

    component.select('x')
    component.keyup('y')

    expect(spy).toHaveBeenCalledWith('x')
    expect(spy).toHaveBeenCalledWith('y')
  })

  it('Given current equals value, When selected is evaluated, Then it returns true', () => {
    const component = create()

    Object.assign(component, { value: signal('X') })
    component.current.set('X')

    expect(component.selected()).toBe(true)
  })
})
