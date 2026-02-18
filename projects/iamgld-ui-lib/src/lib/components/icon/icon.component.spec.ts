import { signal } from '@angular/core'
import { TestBed } from '@angular/core/testing'

import { Icon } from './icon.component'

describe('Icon', () => {
  const create = () => TestBed.runInInjectionContext(() => new Icon())

  it('Given disabled is false, When emitClick is called, Then clicked is emitted', () => {
    const component = create()
    const spy = vi.spyOn(component.clicked, 'emit')

    component.emitClick()

    expect(spy).toHaveBeenCalledOnce()
  })

  it('Given disabled is true, When keyup is called, Then clicked is not emitted', () => {
    const component = create()
    const spy = vi.spyOn(component.clicked, 'emit')

    Object.assign(component, { disabled: signal(true) })

    component.keyup()

    expect(spy).not.toHaveBeenCalled()
  })
})
