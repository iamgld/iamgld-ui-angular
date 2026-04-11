import { TestBed } from '@angular/core/testing'
import { CookieService } from 'ngx-cookie-service'
import { COOKIES_KEYS, ICONS, UI_THEMES } from '../models'
import { ThemeService } from '../services'
import { AuthenticationStore } from './authentication/authentication-store'
import { ThemeStore } from './theme/theme-store'

describe('stores', () => {
  it('Given test context, When executing, Then validates expected behavior', () => {
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

  it('Given test context, When executing, Then validates expected behavior', () => {
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

  it('Given test context, When executing, Then validates expected behavior', () => {
    const themeServiceMock = {
      changeTheme: vi.fn(),
    }

    TestBed.configureTestingModule({
      providers: [ThemeStore, { provide: ThemeService, useValue: themeServiceMock }],
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
