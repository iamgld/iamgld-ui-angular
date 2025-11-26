// Store Imports
import { inject } from '@angular/core'
import { patchState, signalStore, withMethods, withState } from '@ngrx/signals'
// Thirdparty Imports
import { CookiesKeys } from '@ui/models'
import { CookieService } from 'ngx-cookie-service'

export interface AuthState {
  logged: boolean
  accessToken: string
  refreshToken: string
}

export const initialAuthState: AuthState = {
  logged: false,
  accessToken: '',
  refreshToken: '',
}

export const AuthStore = signalStore(
  withState(initialAuthState),
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

      patchState(store, (previous: AuthState) => ({
        ...previous,
        logged: true,
        accessToken,
        refreshToken,
      }))
    },
    signout: (): void => {
      cookiesService.delete(CookiesKeys.accessToken)
      cookiesService.delete(CookiesKeys.refreshToken)

      patchState(store, (previous: AuthState) => ({
        ...previous,
        logged: false,
        accessToken: '',
        refreshToken: '',
      }))
    },
  })),
)
