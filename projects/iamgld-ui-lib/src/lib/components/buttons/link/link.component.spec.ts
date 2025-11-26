// Angular Imports
import { NgTemplateOutlet } from '@angular/common'
import { RouterLink } from '@angular/router'
// Thirdparty Imports
import { createComponentFactory, Spectator } from '@ngneat/spectator/jest'
// This Component Imports
import { LinkComponent } from './link.component'

describe('LinkComponent', () => {
  let spectator: Spectator<LinkComponent>
  const createComponent = createComponentFactory({
    component: LinkComponent,
    imports: [NgTemplateOutlet, RouterLink],
  })

  beforeEach(() => {
    spectator = createComponent({
      props: {
        name: 'link',
      },
    })
  })

  test('should render the component when created', () => {
    expect(spectator).toBeTruthy()
  })
})
