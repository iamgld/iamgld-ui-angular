// Angular Imports
import { RendererFactory2 } from '@angular/core'
// Thirdparty Imports
import { createServiceFactory, SpectatorService } from '@ngneat/spectator/jest'
import { UiTheme } from '../../models'
import { mockRendererFactory } from '../../tests'
// This Component Imports
import { UiService } from './ui.service'

describe('UiService', () => {
  let spectator: SpectatorService<UiService>
  const createService = createServiceFactory({
    service: UiService,
    providers: [{ provide: RendererFactory2, useValue: mockRendererFactory }],
  })

  beforeEach(() => {
    spectator = createService()
    spectator.service['renderer'] = spectator.service['rendererFactory'].createRenderer(null, null)
    jest.clearAllMocks()
    jest.restoreAllMocks()
  })

  test('should create the service when initialized', () => {
    expect(spectator.service).toBeTruthy()
  })

  test('should remove all previous themes and add the new theme when changeTheme is called with UiTheme.dark', () => {
    const renderer = spectator.service['renderer']
    const spyRemove = jest.spyOn(renderer, 'removeClass')
    const spyAdd = jest.spyOn(renderer, 'addClass')
    spectator.service['allThemes'] = [UiTheme.dark, UiTheme.light, UiTheme.system]
    spectator.service.changeTheme(UiTheme.dark)
    expect(spyRemove).toHaveBeenCalledTimes(3)
    expect(spyRemove).toHaveBeenCalledWith(document.body, UiTheme.dark)
    expect(spyRemove).toHaveBeenCalledWith(document.body, UiTheme.light)
    expect(spyRemove).toHaveBeenCalledWith(document.body, UiTheme.system)
    expect(spyAdd).toHaveBeenCalledWith(document.body, UiTheme.dark)
  })

  test('should remove all previous themes and add the new theme when changeTheme is called with UiTheme.light', () => {
    const renderer = spectator.service['renderer']
    const spyRemove = jest.spyOn(renderer, 'removeClass')
    const spyAdd = jest.spyOn(renderer, 'addClass')
    spectator.service['allThemes'] = [UiTheme.dark, UiTheme.light, UiTheme.system]
    spectator.service.changeTheme(UiTheme.light)
    expect(spyRemove).toHaveBeenCalledTimes(3)
    expect(spyRemove).toHaveBeenCalledWith(document.body, UiTheme.dark)
    expect(spyRemove).toHaveBeenCalledWith(document.body, UiTheme.light)
    expect(spyRemove).toHaveBeenCalledWith(document.body, UiTheme.system)
    expect(spyAdd).toHaveBeenCalledWith(document.body, UiTheme.light)
  })

  test('should remove all previous themes and add the new theme when changeTheme is called with UiTheme.system', () => {
    const renderer = spectator.service['renderer']
    const spyRemove = jest.spyOn(renderer, 'removeClass')
    const spyAdd = jest.spyOn(renderer, 'addClass')
    spectator.service['allThemes'] = [UiTheme.dark, UiTheme.light, UiTheme.system]
    spectator.service.changeTheme(UiTheme.system)
    expect(spyRemove).toHaveBeenCalledTimes(3)
    expect(spyRemove).toHaveBeenCalledWith(document.body, UiTheme.dark)
    expect(spyRemove).toHaveBeenCalledWith(document.body, UiTheme.light)
    expect(spyRemove).toHaveBeenCalledWith(document.body, UiTheme.system)
    expect(spyAdd).toHaveBeenCalledWith(document.body, UiTheme.system)
  })

  test('should do nothing when changeTheme is called and document.body is null', () => {
    const renderer = spectator.service['renderer']
    const spyRemove = jest.spyOn(renderer, 'removeClass')
    const spyAdd = jest.spyOn(renderer, 'addClass')
    const originalBody = document.body
    Object.defineProperty(document, 'body', {
      value: null,
      configurable: true,
    })
    expect(() => spectator.service.changeTheme(UiTheme.dark)).not.toThrow()
    expect(spyRemove).not.toHaveBeenCalled()
    expect(spyAdd).not.toHaveBeenCalled()
    Object.defineProperty(document, 'body', {
      value: originalBody,
      configurable: true,
    })
  })
})
