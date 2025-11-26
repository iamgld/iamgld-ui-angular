// Angular Imports
import { Route } from '@angular/router'
// Thirdparty Imports
import { createServiceFactory, SpectatorService } from '@ngneat/spectator/jest'
import { of } from 'rxjs'
// This Component Imports
import { CustomPreloadingStrategyService } from './custom-preload-strategy.service'

describe('CustomPreloadingStrategyService', () => {
  let spectator: SpectatorService<CustomPreloadingStrategyService>
  const createService = createServiceFactory(CustomPreloadingStrategyService)

  beforeEach(() => {
    spectator = createService()
  })

  test('should create the service when initialized', () => {
    expect(spectator.service).toBeTruthy()
  })

  test('should call load when route data.preload is true', () => {
    const route: Route = { path: 'test', data: { preload: true } }

    const load = jest.fn(() => of(void 0))
    const observable = spectator.service.preload(route, load)
    observable.subscribe((response) => {
      expect(response).toBeUndefined()
    })
    expect(load).toHaveBeenCalled()
  })

  test('should return null when route data.preload is false', () => {
    const route: Route = { path: 'test', data: { preload: false } }

    const load = jest.fn()
    const observable = spectator.service.preload(route, load)
    observable.subscribe((response) => {
      expect(response).toBeNull()
    })
    expect(load).not.toHaveBeenCalled()
  })

  test('should return null when route data.preload is undefined', () => {
    const route: Route = { path: 'test', data: { preload: undefined } }
    const load = jest.fn()
    const observable = spectator.service.preload(route, load)
    observable.subscribe((response) => {
      expect(response).toBeNull()
    })
    expect(load).not.toHaveBeenCalled()
  })

  test('should return null when route data exists but preload is missing', () => {
    const route: Route = { path: 'test', data: {} }
    const load = jest.fn()
    const observable = spectator.service.preload(route, load)
    observable.subscribe((response) => {
      expect(response).toBeNull()
    })
    expect(load).not.toHaveBeenCalled()
  })

  test('should return null when route data is undefined', () => {
    const route: Route = { path: 'test' }

    const load = jest.fn()
    const observable = spectator.service.preload(route, load)
    observable.subscribe((response) => {
      expect(response).toBeNull()
    })
    expect(load).not.toHaveBeenCalled()
  })
})
