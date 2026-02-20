import { TestBed } from '@angular/core/testing'

import { IconButtonComponent } from './icon-button.component'

describe('IconButtonComponent', () => {
  const create = () => TestBed.runInInjectionContext(() => new IconButtonComponent())

  it('Given disabled is false, When keyup is called, Then clicked is emitted', () => {
    const component = create()
    const spy = vi.spyOn(component.clicked, 'emit')

    component.keyup()

    expect(spy).toHaveBeenCalledOnce()
  })
})
