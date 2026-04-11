// Store Imports
import { inject } from '@angular/core'
import { patchState, signalStore, withMethods, withState } from '@ngrx/signals'
// Thirdparty Imports
import { CookieService } from 'ngx-cookie-service'
// This Module Imports
import { COOKIES_KEYS } from '../../models'

export interface AuthenticationState {
  logged: boolean
  accessToken: string
  refreshToken: string
}

export const initialAuthenticationState: AuthenticationState = {
  logged: false,
  accessToken: '',
  refreshToken: '',
}

export const AuthenticationStore = signalStore(
  withState(initialAuthenticationState),
  withMethods((store, cookiesService = inject(CookieService)) => ({
    signin: (parameters: {
      accessToken: string
      refreshToken: string
      saveCookie?: boolean
    }): void => {
      const { accessToken, refreshToken, saveCookie = true } = parameters

      if (saveCookie) {
        cookiesService.set(COOKIES_KEYS.accessToken, accessToken)
        cookiesService.set(COOKIES_KEYS.refreshToken, refreshToken)
      }

      patchState(store, (previous: AuthenticationState) => ({
        ...previous,
        logged: true,
        accessToken,
        refreshToken,
      }))
    },
    signout: (): void => {
      cookiesService.delete(COOKIES_KEYS.accessToken)
      cookiesService.delete(COOKIES_KEYS.refreshToken)

      patchState(store, (previous: AuthenticationState) => ({
        ...previous,
        logged: false,
        accessToken: '',
        refreshToken: '',
      }))
    },
  })),
)
