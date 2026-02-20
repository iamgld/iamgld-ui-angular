import { TestBed } from '@angular/core/testing'
import { Router } from '@angular/router'
import { CookieService } from 'ngx-cookie-service'
import { AuthenticationStore } from '../../stores'
import { isLogged } from './is-logged.guard'

describe('isLogged guard', () => {
  const routerMock = { navigate: vi.fn() }
  const cookieServiceMock = { get: vi.fn() }
  const authenticationStoreMock = {
    logged: vi.fn(),
    signin: vi.fn(),
    signout: vi.fn(),
  }

  beforeEach(() => {
    vi.clearAllMocks()

    TestBed.configureTestingModule({
      providers: [
        { provide: Router, useValue: routerMock },
        { provide: CookieService, useValue: cookieServiceMock },
        { provide: AuthenticationStore, useValue: authenticationStoreMock },
      ],
    })
  })

  it('should return true when tokens are present (Given/When/Then)', () => {
    // Given
    cookieServiceMock.get.mockImplementation((key: string) =>
      key.includes('access') ? 'access-token' : 'refresh-token',
    )
    authenticationStoreMock.logged.mockReturnValue(false)

    // When
    const result = TestBed.runInInjectionContext(() => isLogged({} as never, {} as never))

    // Then
    expect(result).toBe(true)
    expect(authenticationStoreMock.signin).toHaveBeenCalledWith({
      accessToken: 'access-token',
      refreshToken: 'refresh-token',
    })
  })

  it('should return false and redirect when tokens are missing (Given/When/Then)', () => {
    // Given
    cookieServiceMock.get.mockReturnValue('')
    authenticationStoreMock.logged.mockReturnValue(true)

    // When
    const result = TestBed.runInInjectionContext(() => isLogged({} as never, {} as never))

    // Then
    expect(result).toBe(false)
    expect(authenticationStoreMock.signout).toHaveBeenCalledTimes(1)
    expect(routerMock.navigate).toHaveBeenCalledWith(['/signin'])
  })

  it('should return false in non-browser execution (Given/When/Then)', () => {
    // Given
    vi.stubGlobal('window', undefined)

    // When
    const result = TestBed.runInInjectionContext(() => isLogged({} as never, {} as never))

    // Then
    expect(result).toBe(false)
    vi.unstubAllGlobals()
  })
})
