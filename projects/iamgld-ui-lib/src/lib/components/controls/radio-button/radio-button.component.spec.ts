import { signal } from '@angular/core'
import { TestBed } from '@angular/core/testing'

import { RadioButton } from './radio-button.component'

describe('RadioButton', () => {
  const create = () => TestBed.runInInjectionContext(() => new RadioButton())

  it('Given an output spy, When select and keyup are called, Then changeValue emits both values', () => {
    const component = create()
    const spy = vi.spyOn(component.changeValue, 'emit')

    component.select('A')
    component.keyup('B')

    expect(spy).toHaveBeenCalledWith('A')
    expect(spy).toHaveBeenCalledWith('B')
  })

  it('Given current equals value, When selected is evaluated, Then it returns true', () => {
    const component = create()

    Object.assign(component, { value: signal('A') })
    component.current.set('A')

    expect(component.selected()).toBe(true)
  })
})
