import { TestBed } from '@angular/core/testing'
import { CookieService } from 'ngx-cookie-service'
import { COOKIES_KEYS, ICONS, UI_THEMES } from '../models'
import { Theme } from '../services'
import { AuthenticationStore } from './authentication/authentication-store'
import { ThemeStore } from './theme/theme-store'

describe('stores', () => {
  it('AuthenticationStore signin/signout updates state and cookies', () => {
    const cookieServiceMock = {
      set: vi.fn(),
      delete: vi.fn(),
    }

    TestBed.configureTestingModule({
      providers: [AuthenticationStore, { provide: CookieService, useValue: cookieServiceMock }],
    })

    const store = TestBed.inject(AuthenticationStore)

    expect(store.logged()).toBe(false)

    store.signin({ accessToken: 'a', refreshToken: 'r' })
    expect(cookieServiceMock.set).toHaveBeenCalledWith(COOKIES_KEYS.accessToken, 'a')
    expect(cookieServiceMock.set).toHaveBeenCalledWith(COOKIES_KEYS.refreshToken, 'r')
    expect(store.logged()).toBe(true)
    expect(store.accessToken()).toBe('a')
    expect(store.refreshToken()).toBe('r')

    store.signout()
    expect(cookieServiceMock.delete).toHaveBeenCalledWith(COOKIES_KEYS.accessToken)
    expect(cookieServiceMock.delete).toHaveBeenCalledWith(COOKIES_KEYS.refreshToken)
    expect(store.logged()).toBe(false)
  })

  it('AuthenticationStore does not write cookies when saveCookie is false', () => {
    const cookieServiceMock = {
      set: vi.fn(),
      delete: vi.fn(),
    }

    TestBed.configureTestingModule({
      providers: [AuthenticationStore, { provide: CookieService, useValue: cookieServiceMock }],
    })

    const store = TestBed.inject(AuthenticationStore)
    store.signin({ accessToken: 'a', refreshToken: 'r', saveCookie: false })

    expect(cookieServiceMock.set).not.toHaveBeenCalled()
    expect(store.logged()).toBe(true)
  })

  it('ThemeStore changeTheme updates state and delegates to Theme service', () => {
    const themeServiceMock = {
      changeTheme: vi.fn(),
    }

    TestBed.configureTestingModule({
      providers: [ThemeStore, { provide: Theme, useValue: themeServiceMock }],
    })

    const store = TestBed.inject(ThemeStore)

    store.changeTheme({
      theme: UI_THEMES.dark,
      iconTheme: ICONS.moonClearLine,
    })

    expect(themeServiceMock.changeTheme).toHaveBeenCalledWith(UI_THEMES.dark)
    expect(store.theme()).toBe(UI_THEMES.dark)
    expect(store.iconTheme()).toBe(ICONS.moonClearLine)
  })
})
