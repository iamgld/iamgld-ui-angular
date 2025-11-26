// Angular Imports
import { NgTemplateOutlet } from '@angular/common'
// Thirdparty Imports
// import { Icons } from '../../../models'
import { createComponentFactory, Spectator } from '@ngneat/spectator/jest'
import { DropdownMenuTemplateDirective } from '../../../directives'
// This Module Imports
import { ButtonComponent } from '../button/button.component'
import { IconButtonComponent } from '../icon-button/icon-button.component'
// This Component Imports
import { DropdownMenuComponent } from './dropdown-menu.component'

const components = [ButtonComponent, IconButtonComponent]

const directives = [DropdownMenuTemplateDirective]

describe('DropdownMenuComponent', () => {
  let spectator: Spectator<DropdownMenuComponent>
  const createComponent = createComponentFactory({
    component: DropdownMenuComponent,
    imports: [NgTemplateOutlet, ...components, ...directives],
  })

  beforeEach(() => {
    spectator = createComponent({
      props: {
        name: 'dropdown-menu',
        type: 'button',
      },
    })
  })

  test('should render the component when created', () => {
    expect(spectator).toBeTruthy()
  })
})
