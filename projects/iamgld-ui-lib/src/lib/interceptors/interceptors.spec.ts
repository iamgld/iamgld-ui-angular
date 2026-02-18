import { HttpRequest, HttpResponse } from '@angular/common/http'
import { TestBed } from '@angular/core/testing'
import { of, throwError } from 'rxjs'
import {
  TRANSLOCO_LANGUAGE_KEYS,
  TRANSLOCO_LANGUAGE_NAMES,
  type TranslocoLanguageKey,
} from '../models'
import { Authentication, Transloco } from '../services'
import { AuthenticationStore } from '../stores'
import { addToken } from './add-token/add-token.interceptor'
import { changeLanguage } from './change-language/change-language.interceptor'
import { refreshToken } from './refresh-token/refresh-token.interceptor'

describe('interceptors', () => {
  it('addToken injects Authorization value when logged and header exists', (done) => {
    const storeMock = {
      logged: vi.fn().mockReturnValue(true),
      accessToken: vi.fn().mockReturnValue('access-token'),
    }

    TestBed.configureTestingModule({
      providers: [{ provide: AuthenticationStore, useValue: storeMock }],
    })

    const request = new HttpRequest('GET', '/api', {
      headers: undefined,
    }).clone({ headers: undefined }).clone({ setHeaders: { Authorization: 'placeholder' } })

    const next = vi.fn((req: HttpRequest<unknown>) => {
      expect(req.headers.get('Authorization')).toBe('Bearer access-token')
      return of(new HttpResponse({ status: 200 }))
    })

    TestBed.runInInjectionContext(() => addToken(request, next)).subscribe(() => {
      expect(next).toHaveBeenCalledTimes(1)
      done()
    })
  })

  it('changeLanguage maps Language header to query param for GET requests', (done) => {
    const translocoMock = {
      getLanguage: vi.fn().mockReturnValue(TRANSLOCO_LANGUAGE_KEYS.spanish as TranslocoLanguageKey),
    }

    TestBed.configureTestingModule({
      providers: [{ provide: Transloco, useValue: translocoMock }],
    })

    const request = new HttpRequest('GET', '/api', undefined, {
      headers: undefined,
    }).clone({ setHeaders: { Language: 'true' } })

    const next = vi.fn((req: HttpRequest<unknown>) => {
      expect(req.headers.has('Language')).toBe(false)
      expect(req.params.get('language')).toBe(TRANSLOCO_LANGUAGE_NAMES.spanish)
      return of(new HttpResponse({ status: 200 }))
    })

    TestBed.runInInjectionContext(() => changeLanguage(request, next)).subscribe(() => {
      expect(next).toHaveBeenCalledTimes(1)
      done()
    })
  })

  it('refreshToken retries request on 401 when logged', (done) => {
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
        { provide: Authentication, useValue: authMock },
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

    TestBed.runInInjectionContext(() => refreshToken(request, next)).subscribe(() => {
      expect(authMock.refreshAccessToken).toHaveBeenCalledWith({ refreshToken: 'refresh-token' })
      done()
    })
  })

  it('refreshToken forwards non-401 errors', (done) => {
    const storeMock = {
      logged: vi.fn().mockReturnValue(true),
      accessToken: vi.fn().mockReturnValue('access-token'),
      refreshToken: vi.fn().mockReturnValue('refresh-token'),
    }

    TestBed.configureTestingModule({
      providers: [
        { provide: AuthenticationStore, useValue: storeMock },
        { provide: Authentication, useValue: { refreshAccessToken: vi.fn() } },
      ],
    })

    const request = new HttpRequest('GET', '/api').clone({
      setHeaders: { Authorization: 'Bearer token' },
    })

    const next = vi.fn().mockReturnValue(throwError(() => ({ status: 500, message: 'boom' })))

    TestBed.runInInjectionContext(() => refreshToken(request, next)).subscribe({
      next: () => done.fail('Expected error path'),
      error: (error) => {
        expect(error).toMatchObject({ status: 500, message: 'boom' })
        done()
      },
    })
  })
})
