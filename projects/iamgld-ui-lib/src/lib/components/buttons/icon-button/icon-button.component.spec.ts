import { TestBed } from '@angular/core/testing'

import { IconButton } from './icon-button.component'

describe('IconButton', () => {
  const create = () => TestBed.runInInjectionContext(() => new IconButton())

  it('Given disabled is false, When keyup is called, Then clicked is emitted', () => {
    const component = create()
    const spy = vi.spyOn(component.clicked, 'emit')

    component.keyup()

    expect(spy).toHaveBeenCalledOnce()
  })
})
