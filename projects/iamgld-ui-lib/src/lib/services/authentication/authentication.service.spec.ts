import { HttpClient } from '@angular/common/http'
import { Injector } from '@angular/core'
import { Router } from '@angular/router'
import { of, throwError } from 'rxjs'
import { Environment } from '../../models'
import { AuthenticationStore } from '../../stores'
import { SERVICES_ENVIRONMENT_TOKEN } from '../services-environment-token'
import { Authentication } from './authentication.service'

describe('Authentication service', () => {
  let service: Authentication
  let injector: Injector

  const httpMock = {
    post: vi.fn(),
  }

  const routerMock = {
    navigate: vi.fn(),
  }

  const authenticationStoreMock = {
    signin: vi.fn(),
    signout: vi.fn(),
  }

  const environmentMock: Environment = {
    environmentType: 'local',
    production: false,
    iamgldApi: 'https://api.test.dev',
    cloudflareIamgldAssetsBucket: 'assets-bucket',
  }

  beforeEach(() => {
    vi.clearAllMocks()

    injector = Injector.create({
      providers: [
        Authentication,
        { provide: HttpClient, useValue: httpMock },
        { provide: Router, useValue: routerMock },
        { provide: AuthenticationStore, useValue: authenticationStoreMock },
        { provide: SERVICES_ENVIRONMENT_TOKEN, useValue: environmentMock },
      ],
    })

    service = injector.get(Authentication)
  })

  describe('signin', () => {
    it('stores tokens when API response is valid', async () => {
      httpMock.post.mockReturnValue(
        of({ accessToken: 'access-token', refreshToken: 'refresh-token' }),
      )

      await expect(
        new Promise<void>((resolve, reject) => {
          service.signin({ email: 'user@mail.com', password: 'secret' }).subscribe({
            next: () => resolve(),
            error: reject,
          })
        }),
      ).resolves.toBeUndefined()

      expect(httpMock.post).toHaveBeenCalledWith('https://api.test.dev/v1/auth/signin', {
        email: 'user@mail.com',
        password: 'secret',
      })
      expect(authenticationStoreMock.signin).toHaveBeenCalledWith({
        accessToken: 'access-token',
        refreshToken: 'refresh-token',
      })
    })

    it('throws when API response is malformed', async () => {
      httpMock.post.mockReturnValue(of({ accessToken: 'access-token' }))

      await expect(
        new Promise<void>((resolve, reject) => {
          service.signin({ email: 'user@mail.com', password: 'secret' }).subscribe({
            next: () => resolve(),
            error: reject,
          })
        }),
      ).rejects.toThrow('signin')

      expect(authenticationStoreMock.signin).not.toHaveBeenCalled()
    })

    it('propagates HTTP errors', async () => {
      httpMock.post.mockReturnValue(
        throwError(() => ({ status: 500, message: 'unexpected-error' })),
      )

      await expect(
        new Promise<void>((resolve, reject) => {
          service.signin({ email: 'user@mail.com', password: 'secret' }).subscribe({
            next: () => resolve(),
            error: reject,
          })
        }),
      ).rejects.toMatchObject({ status: 500, message: 'unexpected-error' })
    })
  })

  describe('refreshAccessToken', () => {
    it('stores tokens without cookies when response is valid', async () => {
      httpMock.post.mockReturnValue(
        of({ accessToken: 'new-access-token', refreshToken: 'new-refresh-token' }),
      )

      await expect(
        new Promise<void>((resolve, reject) => {
          service.refreshAccessToken({ refreshToken: 'old-refresh-token' }).subscribe({
            next: () => resolve(),
            error: reject,
          })
        }),
      ).resolves.toBeUndefined()

      expect(httpMock.post).toHaveBeenCalledWith('https://api.test.dev/v1/auth/refresh', {
        refreshToken: 'old-refresh-token',
      })
      expect(authenticationStoreMock.signin).toHaveBeenCalledWith({
        accessToken: 'new-access-token',
        refreshToken: 'new-refresh-token',
        saveCookie: false,
      })
      expect(authenticationStoreMock.signout).not.toHaveBeenCalled()
      expect(routerMock.navigate).not.toHaveBeenCalled()
    })

    it('logs out and redirects when jwt is expired', async () => {
      httpMock.post.mockReturnValue(
        throwError(() => ({
          error: {
            statusCode: 401,
            message: 'jwt expired',
          },
        })),
      )

      await expect(
        new Promise<void>((resolve, reject) => {
          service.refreshAccessToken({ refreshToken: 'expired' }).subscribe({
            next: () => resolve(),
            error: reject,
          })
        }),
      ).rejects.toThrow('Session expired. Please log in again.')

      expect(authenticationStoreMock.signout).toHaveBeenCalledTimes(1)
      expect(routerMock.navigate).toHaveBeenCalledWith(['/signin'])
    })

    it('propagates non-auth errors', async () => {
      httpMock.post.mockReturnValue(
        throwError(() => ({
          error: {
            statusCode: 500,
            message: 'server error',
          },
        })),
      )

      await expect(
        new Promise<void>((resolve, reject) => {
          service.refreshAccessToken({ refreshToken: '' }).subscribe({
            next: () => resolve(),
            error: reject,
          })
        }),
      ).rejects.toMatchObject({
        error: {
          statusCode: 500,
          message: 'server error',
        },
      })

      expect(authenticationStoreMock.signout).not.toHaveBeenCalled()
    })

    it('logs out and redirects when response body is empty', async () => {
      httpMock.post.mockReturnValue(of(undefined))

      await expect(
        new Promise<void>((resolve, reject) => {
          service.refreshAccessToken({ refreshToken: 'token' }).subscribe({
            next: () => resolve(),
            error: reject,
          })
        }),
      ).rejects.toThrow('refreshAccessToken')

      expect(authenticationStoreMock.signout).toHaveBeenCalledTimes(1)
      expect(routerMock.navigate).toHaveBeenCalledWith(['/signin'])
      expect(authenticationStoreMock.signin).not.toHaveBeenCalled()
    })
  })
})
