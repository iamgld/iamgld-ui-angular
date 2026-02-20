import { TestBed } from '@angular/core/testing'

import { LinkComponent } from './link.component'

describe('LinkComponent', () => {
  const create = () => TestBed.runInInjectionContext(() => new LinkComponent())

  it('Given a link instance, When emitClick and keyup are called, Then clicked is emitted each time', () => {
    const component = create()
    const spy = vi.spyOn(component.clicked, 'emit')

    component.emitClick()
    component.keyup()

    expect(spy).toHaveBeenCalledTimes(2)
  })
})
