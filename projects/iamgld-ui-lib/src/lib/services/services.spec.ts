import { HttpClient } from '@angular/common/http'
import { RendererFactory2 } from '@angular/core'
import { TestBed } from '@angular/core/testing'
import { TranslocoService as JsverseTranslocoService } from '@jsverse/transloco'
import { firstValueFrom, of } from 'rxjs'
import { ICONS, TRANSLOCO_LANGUAGE_KEYS, UI_THEMES, type Environment } from '../models'
import { SERVICES_ENVIRONMENT_TOKEN } from './services-environment-token'
import { CustomPreloadingStrategy } from './custom-preload-strategy/custom-preload-strategy.service'
import { Environments } from './environments/environments.service'
import { Theme } from './theme/theme.service'
import { Transloco, TranslocoHttpLoader } from './transloco/transloco.service'

describe('library services', () => {
  describe('CustomPreloadingStrategy', () => {
    it('should preload when route data has preload set to true (Given/When/Then)', async () => {
      // Given
      const service = new CustomPreloadingStrategy()
      const load = vi.fn().mockReturnValue(of(undefined))
      const route = { path: 'admin', data: { preload: true } }

      // When
      const result = await firstValueFrom(service.preload(route, load))

      // Then
      expect(load).toHaveBeenCalledTimes(1)
      expect(result).toBeUndefined()
    })

    it('should return null when preload is false (Given/When/Then)', async () => {
      // Given
      const service = new CustomPreloadingStrategy()
      const load = vi.fn().mockReturnValue(of(undefined))
      const route = { path: 'admin', data: { preload: false } }

      // When
      const result = await firstValueFrom(service.preload(route, load))

      // Then
      expect(load).not.toHaveBeenCalled()
      expect(result).toBeNull()
    })
  })

  describe('Environments', () => {
    it('should return injected environment and label (Given/When/Then)', () => {
      // Given
      const environmentMock: Environment = {
        environmentType: 'local',
        production: false,
        iamgldApi: 'https://api.local',
        cloudflareIamgldAssetsBucket: 'bucket',
      }

      TestBed.configureTestingModule({
        providers: [
          Environments,
          { provide: SERVICES_ENVIRONMENT_TOKEN, useValue: environmentMock },
        ],
      })

      const service = TestBed.inject(Environments)

      // When
      const environment = service.getEnvironment()
      const label = service.getEnvironmentLabel()

      // Then
      expect(environment).toEqual(environmentMock)
      expect(label).toBe('local')
    })
  })

  describe('Theme', () => {
    it('should change classes on document body (Given/When/Then)', () => {
      // Given
      const rendererMock = {
        addClass: vi.fn(),
        removeClass: vi.fn(),
      }

      const rendererFactoryMock = {
        createRenderer: vi.fn().mockReturnValue(rendererMock),
      }

      TestBed.configureTestingModule({
        providers: [Theme, { provide: RendererFactory2, useValue: rendererFactoryMock }],
      })

      const service = TestBed.inject(Theme)

      // When
      service.changeTheme(UI_THEMES.dark)

      // Then
      expect(rendererMock.removeClass).toHaveBeenCalledTimes(3)
      expect(rendererMock.addClass).toHaveBeenCalledWith(document.body, UI_THEMES.dark)
    })
  })

  describe('Transloco', () => {
    it('should change and read language (Given/When/Then)', () => {
      // Given
      const translocoServiceMock = {
        setActiveLang: vi.fn(),
        getActiveLang: vi.fn().mockReturnValue(TRANSLOCO_LANGUAGE_KEYS.spanish),
      }

      TestBed.configureTestingModule({
        providers: [{ provide: JsverseTranslocoService, useValue: translocoServiceMock }, Transloco],
      })

      const service = TestBed.inject(Transloco)

      // When
      service.changeLanguage(TRANSLOCO_LANGUAGE_KEYS.english)
      const language = service.getLanguage()

      // Then
      expect(translocoServiceMock.setActiveLang).toHaveBeenCalledWith(
        TRANSLOCO_LANGUAGE_KEYS.english,
      )
      expect(language).toBe(TRANSLOCO_LANGUAGE_KEYS.spanish)
    })
  })

  describe('TranslocoHttpLoader', () => {
    it('should request translation by language (Given/When/Then)', async () => {
      // Given
      const httpClientMock = {
        get: vi.fn().mockReturnValue(of({ hello: 'world' })),
      }

      TestBed.configureTestingModule({
        providers: [TranslocoHttpLoader, { provide: HttpClient, useValue: httpClientMock }],
      })

      const loader = TestBed.inject(TranslocoHttpLoader)

      // When
      const payload = await firstValueFrom(loader.getTranslation('en'))

      // Then
      expect(payload).toEqual({ hello: 'world' })
      expect(httpClientMock.get).toHaveBeenCalledWith('public/i18n/en.json')
    })
  })

  it('theme constants are usable in tests', () => {
    expect(ICONS.macLine).toBeTruthy()
    expect(UI_THEMES.system).toContain('theme--')
  })
})
