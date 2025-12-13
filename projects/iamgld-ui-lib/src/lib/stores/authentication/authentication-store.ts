// Store Imports
import { inject } from '@angular/core'
import { patchState, signalStore, withMethods, withState } from '@ngrx/signals'
// Thirdparty Imports
import { CookieService } from 'ngx-cookie-service'
// This Module Imports
import { CookiesKeys } from '../../models'

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
        cookiesService.set(CookiesKeys.accessToken, accessToken)
        cookiesService.set(CookiesKeys.refreshToken, refreshToken)
      }

      patchState(store, (previous: AuthenticationState) => ({
        ...previous,
        logged: true,
        accessToken,
        refreshToken,
      }))
    },
    signout: (): void => {
      cookiesService.delete(CookiesKeys.accessToken)
      cookiesService.delete(CookiesKeys.refreshToken)

      patchState(store, (previous: AuthenticationState) => ({
        ...previous,
        logged: false,
        accessToken: '',
        refreshToken: '',
      }))
    },
  })),
)
