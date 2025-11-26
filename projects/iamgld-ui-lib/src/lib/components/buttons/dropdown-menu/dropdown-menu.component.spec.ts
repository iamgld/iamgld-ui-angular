// Angular Imports
import { NgTemplateOutlet } from '@angular/common'
// This Component Imports
import { DropdownMenuComponent } from './dropdown-menu.component'
// This Module Imports
import { ButtonComponent } from '../button/button.component'
import { IconButtonComponent } from '../icon-button/icon-button.component'
// Thirdparty Imports
// import { Icons } from '@ui/models'
import { DropdownMenuTemplateDirective } from '@ui/directives'
import { Spectator, createComponentFactory } from '@ngneat/spectator/jest'

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
