import { signal } from '@angular/core'
import { TestBed } from '@angular/core/testing'

import { SelectOption } from './select-option.component'

describe('SelectOption', () => {
  const create = () => TestBed.runInInjectionContext(() => new SelectOption())

  it('Given disabled is false, When select is called, Then selected emits value', () => {
    const component = create()
    const spy = vi.spyOn(component.selected, 'emit')

    Object.assign(component, { value: signal('opt-1') })

    component.select()

    expect(spy).toHaveBeenCalledWith('opt-1')
  })

  it('Given disabled is true, When keyup is called, Then selected does not emit', () => {
    const component = create()
    const spy = vi.spyOn(component.selected, 'emit')

    Object.assign(component, { value: signal('opt-1'), disabled: signal(true) })

    component.keyup()

    expect(spy).not.toHaveBeenCalled()
  })
})
