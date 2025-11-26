// This Component Imports
import { TileComponent } from './tile.component'
// Thirdparty Imports
import { Spectator, createComponentFactory } from '@ngneat/spectator/jest'

describe('TileComponent', () => {
  let spectator: Spectator<TileComponent>
  const createComponent = createComponentFactory({
    component: TileComponent,
    imports: [],
  })

  beforeEach(() => {
    spectator = createComponent({
      props: {},
    })
  })

  test('should render the component when created', () => {
    expect(spectator).toBeTruthy()
  })

  test('should add class "tile--background" when background is true', () => {
    spectator.setInput('background', true)
    spectator.detectChanges()
    const tileElement = spectator.query('article.tile')
    expect(tileElement?.classList.contains('tile--background')).toBe(true)
  })

  test('should remove class "tile--background" when background is false', () => {
    spectator.setInput('background', false)
    spectator.detectChanges()
    const tileElement = spectator.query('article.tile')
    expect(tileElement?.classList.contains('tile--background')).toBe(false)
  })

  test('should add class "tile--hover" when hover is true', () => {
    spectator.setInput('hover', true)
    spectator.detectChanges()
    const tileElement = spectator.query('article.tile')
    expect(tileElement?.classList.contains('tile--hover')).toBe(true)
  })

  test('should remove class "tile--hover" when hover is false', () => {
    spectator.setInput('hover', false)
    spectator.detectChanges()
    const tileElement = spectator.query('article.tile')
    expect(tileElement?.classList.contains('tile--hover')).toBe(false)
  })
})
