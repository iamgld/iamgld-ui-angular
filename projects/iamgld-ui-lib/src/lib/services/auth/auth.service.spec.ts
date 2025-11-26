// Angular Imports
import { HttpClient } from '@angular/common/http'
import { Router } from '@angular/router'
// Thirdparty Imports
import { createServiceFactory, SpectatorService } from '@ngneat/spectator/jest'
import { of, throwError } from 'rxjs'
import { AuthStore } from '../../stores/auth/auth.store'
import { mockAuthStore, mockEnvironment, mockHttpClient, mockRouter } from '../../tests'
import { SERVICES_ENVIRONMENT } from '../services-environment.token'
// This Component Imports
import { AuthService } from './auth.service'

describe('AuthService', () => {
  let spectator: SpectatorService<AuthService>

  const createService = createServiceFactory({
    service: AuthService,
    providers: [
      { provide: HttpClient, useValue: mockHttpClient },
      { provide: Router, useValue: mockRouter },
      { provide: AuthStore, useValue: mockAuthStore },
      { provide: SERVICES_ENVIRONMENT, useValue: mockEnvironment },
    ],
  })

  beforeEach(() => {
    spectator = createService()
    jest.clearAllMocks()
    jest.restoreAllMocks()
  })

  test('should create the service when initialized', () => {
    expect(spectator.service).toBeTruthy()
  })

  test('should call authStore.signin when signin is called with valid response', (done) => {
    const response = { accessToken: 'token', refreshToken: 'refresh' }
    mockHttpClient.post!.mockReturnValue(of(response))
    spectator.service.signin({ email: 'gregor@email.com', password: '1234' }).subscribe(() => {
      expect(mockAuthStore.signin).toHaveBeenCalledWith({
        accessToken: 'token',
        refreshToken: 'refresh',
      })
      done()
    })
  })

  test('should throw error when signin is called with invalid response', (done) => {
    mockHttpClient.post!.mockReturnValue(of({}))
    spectator.service.signin({ email: 'gregor@email.com', password: '1234' }).subscribe({
      error: (error) => {
        expect(error).toBeInstanceOf(Error)
        done()
      },
    })
  })

  test('should call authStore.signin when refreshAccessToken is called with valid response', (done) => {
    const response = { accessToken: 'token', refreshToken: 'refresh' }
    mockHttpClient.post!.mockReturnValue(of(response))
    spectator.service.refreshAccessToken({ refreshToken: 'refresh' }).subscribe(() => {
      expect(mockAuthStore.signin).toHaveBeenCalledWith({
        accessToken: 'token',
        refreshToken: 'refresh',
        saveCookie: false,
      })
      done()
    })
  })

  test('should call authStore.signout and router.navigate when refreshAccessToken returns 401 jwt expired', (done) => {
    const error = { error: { statusCode: 401, message: 'jwt expired' } }
    mockHttpClient.post!.mockReturnValue(throwError(() => error))
    spectator.service.refreshAccessToken({ refreshToken: 'refresh' }).subscribe({
      error: (error) => {
        expect(mockAuthStore.signout).toHaveBeenCalled()
        expect(mockRouter.navigate).toHaveBeenCalledWith(['/signin'])
        expect(error).toBeInstanceOf(Error)
        done()
      },
    })
  })

  test('should rethrow error when refreshAccessToken fails with non-401 error', (done) => {
    const error = { error: { statusCode: 500, message: 'server error' } }
    mockHttpClient.post!.mockReturnValue(throwError(() => error))
    spectator.service.refreshAccessToken({ refreshToken: 'refresh' }).subscribe({
      error: (_error) => {
        expect(_error).toBe(error)
        done()
      },
    })
  })

  test('should call authStore.signout and router.navigate when refreshAccessToken is called with invalid response', (done) => {
    mockHttpClient.post!.mockReturnValue(of({}))
    spectator.service.refreshAccessToken({ refreshToken: 'refresh' }).subscribe({
      error: (error) => {
        expect(mockAuthStore.signout).toHaveBeenCalled()
        expect(mockRouter.navigate).toHaveBeenCalledWith(['/signin'])
        expect(error).toBeInstanceOf(Error)
        done()
      },
    })
  })
})
