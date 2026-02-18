import { HttpClient } from '@angular/common/http'
import { RendererFactory2 } from '@angular/core'
import { TestBed } from '@angular/core/testing'
import { TranslocoService as JsverseTranslocoService } from '@jsverse/transloco'
import { of } from 'rxjs'
import { ICONS, TRANSLOCO_LANGUAGE_KEYS, UI_THEMES, type Environment } from '../models'
import { SERVICES_ENVIRONMENT_TOKEN } from './services-environment-token'
import { CustomPreloadingStrategy } from './custom-preload-strategy/custom-preload-strategy.service'
import { Environments } from './environments/environments.service'
import { Theme } from './theme/theme.service'
import { Transloco, TranslocoHttpLoader } from './transloco/transloco.service'

describe('library services', () => {
  it('CustomPreloadingStrategy preloads when route.data.preload is true', (done) => {
    const service = new CustomPreloadingStrategy()
    const load = vi.fn().mockReturnValue(of(undefined))

    service.preload({ path: 'admin', data: { preload: true } }, load).subscribe((result) => {
      expect(load).toHaveBeenCalledTimes(1)
      expect(result).toBeUndefined()
      done()
    })
  })

  it('CustomPreloadingStrategy returns null when preload is false', (done) => {
    const service = new CustomPreloadingStrategy()
    const load = vi.fn().mockReturnValue(of(undefined))

    service.preload({ path: 'admin', data: { preload: false } }, load).subscribe((result) => {
      expect(load).not.toHaveBeenCalled()
      expect(result).toBeNull()
      done()
    })
  })

  it('Environments returns injected environment and label', () => {
    const environmentMock: Environment = {
      environmentType: 'local',
      production: false,
      iamgldApi: 'https://api.local',
      cloudflareIamgldAssetsBucket: 'bucket',
    }

    TestBed.configureTestingModule({
      providers: [Environments, { provide: SERVICES_ENVIRONMENT_TOKEN, useValue: environmentMock }],
    })

    const service = TestBed.inject(Environments)
    expect(service.getEnvironment()).toEqual(environmentMock)
    expect(service.getEnvironmentLabel()).toBe('local')
  })

  it('Theme changes classes on document body', () => {
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
    service.changeTheme(UI_THEMES.dark)

    expect(rendererMock.removeClass).toHaveBeenCalledTimes(3)
    expect(rendererMock.addClass).toHaveBeenCalledWith(document.body, UI_THEMES.dark)
  })

  it('Transloco changes and reads language', () => {
    const translocoServiceMock = {
      setActiveLang: vi.fn(),
      getActiveLang: vi.fn().mockReturnValue(TRANSLOCO_LANGUAGE_KEYS.spanish),
    }

    TestBed.configureTestingModule({
      providers: [{ provide: JsverseTranslocoService, useValue: translocoServiceMock }, Transloco],
    })

    const service = TestBed.inject(Transloco)
    service.changeLanguage(TRANSLOCO_LANGUAGE_KEYS.english)

    expect(translocoServiceMock.setActiveLang).toHaveBeenCalledWith(TRANSLOCO_LANGUAGE_KEYS.english)
    expect(service.getLanguage()).toBe(TRANSLOCO_LANGUAGE_KEYS.spanish)
  })

  it('TranslocoHttpLoader requests translation by language', () => {
    const httpClientMock = {
      get: vi.fn().mockReturnValue(of({ hello: 'world' })),
    }

    TestBed.configureTestingModule({
      providers: [TranslocoHttpLoader, { provide: HttpClient, useValue: httpClientMock }],
    })

    const loader = TestBed.inject(TranslocoHttpLoader)
    loader.getTranslation('en').subscribe((payload) => {
      expect(payload).toEqual({ hello: 'world' })
    })

    expect(httpClientMock.get).toHaveBeenCalledWith('public/i18n/en.json')
  })

  it('theme constants are usable in tests', () => {
    expect(ICONS.macLine).toBeTruthy()
    expect(UI_THEMES.system).toContain('theme--')
  })
})
