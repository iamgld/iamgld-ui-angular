// Angular Imports
import { NgTemplateOutlet } from '@angular/common'
import { RouterLink } from '@angular/router'
// This Component Imports
import { LinkComponent } from './link.component'
// Thirdparty Imports
import { Spectator, createComponentFactory } from '@ngneat/spectator/jest'

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
