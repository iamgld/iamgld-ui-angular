// Angular Imports
import { NgOptimizedImage } from '@angular/common'
// This Component Imports
import { ImageComponent } from './image.component'
// Thirdparty Imports
import { Spectator, createComponentFactory } from '@ngneat/spectator/jest'

describe('ImageComponent', () => {
  let spectator: Spectator<ImageComponent>
  const createComponent = createComponentFactory({
    component: ImageComponent,
    imports: [NgOptimizedImage],
  })

  beforeEach(() => {
    spectator = createComponent({
      props: {
        src: 'https://example.com/image.jpg',
        alt: 'Example Image',
      },
    })
  })

  test('should render the component when created', () => {
    expect(spectator).toBeTruthy()
  })

  test('should add "priority" attribute when priority is true', () => {
    spectator.setInput('priority', true)
    spectator.detectChanges()
    const img = spectator.query('img')
    expect(img?.hasAttribute('priority')).toBe(true)
    expect(img?.hasAttribute('loading')).toBe(true)
    expect(img?.getAttribute('loading')).toBe('eager')
  })

  test('should remove "priority" attribute when priority is false', () => {
    spectator.setInput('priority', false)
    spectator.detectChanges()
    const img = spectator.query('img')
    expect(img?.hasAttribute('priority')).toBe(false)
    expect(img?.hasAttribute('loading')).toBe(true)
    expect(img?.getAttribute('loading')).toBe('lazy')
  })
})
