import { HttpRequest, HttpResponse } from '@angular/common/http'
import { TestBed } from '@angular/core/testing'
import { firstValueFrom, of, throwError } from 'rxjs'
import {
  TRANSLOCO_LANGUAGE_KEYS,
  TRANSLOCO_LANGUAGE_NAMES,
  type TranslocoLanguageKey,
} from '../models'
import { AuthenticationService, TranslocoService } from '../services'
import { AuthenticationStore } from '../stores'
import { addToken } from './add-token/add-token.interceptor'
import { changeLanguage } from './change-language/change-language.interceptor'
import { refreshToken } from './refresh-token/refresh-token.interceptor'

describe('interceptors', () => {
  describe('addToken', () => {
  it('Given test context, When executing, Then validates expected behavior', async () => {
      // Given
      const storeMock = {
        logged: vi.fn().mockReturnValue(true),
        accessToken: vi.fn().mockReturnValue('access-token'),
      }

      TestBed.configureTestingModule({
        providers: [{ provide: AuthenticationStore, useValue: storeMock }],
      })

      const request = new HttpRequest('GET', '/api', {
        headers: undefined,
      })
        .clone({ headers: undefined })
        .clone({ setHeaders: { Authorization: 'placeholder' } })

      const next = vi.fn((req: HttpRequest<unknown>) => {
        expect(req.headers.get('Authorization')).toBe('Bearer access-token')
        return of(new HttpResponse({ status: 200 }))
      })

      // When
      await firstValueFrom(TestBed.runInInjectionContext(() => addToken(request, next)))

      // Then
      expect(next).toHaveBeenCalledTimes(1)
    })
  })

  describe('changeLanguage', () => {
  it('Given test context, When executing, Then validates expected behavior', async () => {
      // Given
      const translocoMock = {
        getLanguage: vi.fn().mockReturnValue(TRANSLOCO_LANGUAGE_KEYS.spanish as TranslocoLanguageKey),
      }

      TestBed.configureTestingModule({
        providers: [{ provide: TranslocoService, useValue: translocoMock }],
      })

      const request = new HttpRequest('GET', '/api', undefined, {
        headers: undefined,
      }).clone({ setHeaders: { Language: 'true' } })

      const next = vi.fn((req: HttpRequest<unknown>) => {
        expect(req.headers.has('Language')).toBe(false)
        expect(req.params.get('language')).toBe(TRANSLOCO_LANGUAGE_NAMES.spanish)
        return of(new HttpResponse({ status: 200 }))
      })

      // When
      await firstValueFrom(TestBed.runInInjectionContext(() => changeLanguage(request, next)))

      // Then
      expect(next).toHaveBeenCalledTimes(1)
    })
  })

  describe('refreshToken', () => {
  it('Given test context, When executing, Then validates expected behavior', async () => {
      // Given
      const storeMock = {
        logged: vi.fn().mockReturnValue(true),
        accessToken: vi.fn().mockReturnValue('new-access-token'),
        refreshToken: vi.fn().mockReturnValue('refresh-token'),
      }

      const authMock = {
        refreshAccessToken: vi.fn().mockReturnValue(of(undefined)),
      }

      TestBed.configureTestingModule({
        providers: [
          { provide: AuthenticationStore, useValue: storeMock },
          { provide: AuthenticationService, useValue: authMock },
        ],
      })

      const request = new HttpRequest('GET', '/api').clone({
        setHeaders: { Authorization: 'Bearer old-token' },
      })

      const next = vi
        .fn()
        .mockReturnValueOnce(throwError(() => ({ status: 401 })))
        .mockImplementation((req: HttpRequest<unknown>) => {
          expect(req.headers.get('Authorization')).toBe('Bearer new-access-token')
          return of(new HttpResponse({ status: 200 }))
        })

      // When
      await firstValueFrom(TestBed.runInInjectionContext(() => refreshToken(request, next)))

      // Then
      expect(authMock.refreshAccessToken).toHaveBeenCalledWith({ refreshToken: 'refresh-token' })
    })

  it('Given test context, When executing, Then validates expected behavior', async () => {
      // Given
      const storeMock = {
        logged: vi.fn().mockReturnValue(true),
        accessToken: vi.fn().mockReturnValue('access-token'),
        refreshToken: vi.fn().mockReturnValue('refresh-token'),
      }

      TestBed.configureTestingModule({
        providers: [
          { provide: AuthenticationStore, useValue: storeMock },
          { provide: AuthenticationService, useValue: { refreshAccessToken: vi.fn() } },
        ],
      })

      const request = new HttpRequest('GET', '/api').clone({
        setHeaders: { Authorization: 'Bearer token' },
      })

      const next = vi.fn().mockReturnValue(throwError(() => ({ status: 500, message: 'boom' })))

      // When & Then
      try {
        await firstValueFrom(TestBed.runInInjectionContext(() => refreshToken(request, next)))
        throw new Error('Expected error path')
      } catch (error) {
        expect(error).toMatchObject({ status: 500, message: 'boom' })
      }
    })
  })
})
