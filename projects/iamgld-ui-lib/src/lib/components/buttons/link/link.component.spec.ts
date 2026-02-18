import { TestBed } from '@angular/core/testing'

import { Link } from './link.component'

describe('Link', () => {
  const create = () => TestBed.runInInjectionContext(() => new Link())

  it('Given a link instance, When emitClick and keyup are called, Then clicked is emitted each time', () => {
    const component = create()
    const spy = vi.spyOn(component.clicked, 'emit')

    component.emitClick()
    component.keyup()

    expect(spy).toHaveBeenCalledTimes(2)
  })
})
