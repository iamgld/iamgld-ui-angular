// Angular Imports
import { HttpClient } from '@angular/common/http'
// This Component Imports
import { TranslocoService } from './transloco.service'
import { TranslocoHttpLoader } from './transloco.service'
// Thirdparty Imports
import { TranslocoLanguageKey } from '@ui/models'
import { mockHttpClient } from '@ui/tests'
import { createServiceFactory, SpectatorService } from '@ngneat/spectator/jest'
import { TranslocoService as JsverseTranslocoService, Translation } from '@jsverse/transloco'
import { of } from 'rxjs'

describe('TranslocoService', () => {
  let spectator: SpectatorService<TranslocoService>

  const mockJsverseTranslocoService: Partial<jest.Mocked<JsverseTranslocoService>> = {
    setActiveLang: jest.fn(),
    getActiveLang: jest.fn(),
  }

  const createService = createServiceFactory({
    service: TranslocoService,
    providers: [{ provide: JsverseTranslocoService, useValue: mockJsverseTranslocoService }],
  })

  beforeEach(() => {
    spectator = createService()
    jest.clearAllMocks()
    jest.restoreAllMocks()
  })

  it('should create the service when initialized', () => {
    expect(spectator).toBeTruthy()
  })

  it('should call setActiveLang when changeLanguage is called', () => {
    const language = TranslocoLanguageKey.english
    spectator.service.changeLanguage(language)
    expect(mockJsverseTranslocoService.setActiveLang).toHaveBeenCalledWith(language)
  })

  it('should return the active language from getLanguage', () => {
    mockJsverseTranslocoService.getActiveLang!.mockReturnValue(TranslocoLanguageKey.english)
    const language = spectator.service.getLanguage()
    expect(language).toBe(TranslocoLanguageKey.english)
  })
})

describe('TranslocoHttpLoader', () => {
  let spectator: SpectatorService<TranslocoHttpLoader>

  const createService = createServiceFactory({
    service: TranslocoHttpLoader,
    providers: [{ provide: HttpClient, useValue: mockHttpClient }],
  })

  beforeEach(() => {
    spectator = createService()
    jest.clearAllMocks()
    jest.restoreAllMocks()
  })

  it('should create the service when initialized', () => {
    expect(spectator).toBeTruthy()
  })

  it('should call HttpClient.get with the correct URL and return the observable', (done) => {
    const language = TranslocoLanguageKey.english
    const translation: Translation = { hello: 'Hello' }
    mockHttpClient.get!.mockReturnValue(of(translation))
    const observable = spectator.service.getTranslation(language)
    expect(mockHttpClient.get).toHaveBeenCalledWith('assets/i18n/en.json')
    observable.subscribe((response) => {
      expect(response).toEqual(translation)
      done()
    })
  })
})
