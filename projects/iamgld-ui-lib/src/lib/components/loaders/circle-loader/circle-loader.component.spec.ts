// This Component Imports
import { CircleLoaderComponent } from './circle-loader.component'
// Thirdparty Imports
import { Spectator, createComponentFactory } from '@ngneat/spectator/jest'

describe('CircleLoaderComponent', () => {
  let spectator: Spectator<CircleLoaderComponent>
  const createComponent = createComponentFactory({
    component: CircleLoaderComponent,
    imports: [],
  })

  beforeEach(() => {
    spectator = createComponent({
      props: {
        loading: false,
        background: false,
        radius: false,
        minHeight: 'auto',
      },
    })
  })

  test('should render the component when created', () => {
    expect(spectator).toBeTruthy()
  })

  test('should add class "loader--loading" when loading is true', () => {
    spectator.setInput('loading', true)
    spectator.detectChanges()
    const loaderElement = spectator.query('article.loader')
    expect(loaderElement?.classList.contains('loader--loading')).toBe(true)
  })

  test('should add section "loader-loading" when loading is true', () => {
    spectator.setInput('loading', true)
    spectator.detectChanges()
    const loaderLoadingElement = spectator.query('.loader-loading')
    expect(loaderLoadingElement).not.toBeNull()
  })

  test('should remove class "loader--loading" when loading is false', () => {
    spectator.setInput('loading', false)
    spectator.detectChanges()
    const loaderElement = spectator.query('article.loader')
    expect(loaderElement?.classList.contains('loader--loading')).toBe(false)
  })

  test('should add class "loader--background" when background is true', () => {
    spectator.setInput('background', true)
    spectator.detectChanges()
    const loaderElement = spectator.query('article.loader')
    expect(loaderElement?.classList.contains('loader--background')).toBe(true)
  })

  test('should remove class "loader--background" when background is false', () => {
    spectator.setInput('background', false)
    spectator.detectChanges()
    const loaderElement = spectator.query('article.loader')
    expect(loaderElement?.classList.contains('loader--background')).toBe(false)
  })

  test('should add class "loader--radius" when radius is true', () => {
    spectator.setInput('radius', true)
    spectator.detectChanges()
    const loaderElement = spectator.query('article.loader')
    expect(loaderElement?.classList.contains('loader--radius')).toBe(true)
  })

  test('should remove class "loader--radius" when radius is false', () => {
    spectator.setInput('radius', false)
    spectator.detectChanges()
    const loaderElement = spectator.query('article.loader')
    expect(loaderElement?.classList.contains('loader--radius')).toBe(false)
  })
})
