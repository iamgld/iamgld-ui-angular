// Angular Imports
import { inject } from '@angular/core'
import { CanActivateFn, Router } from '@angular/router'
// Thirdparty Imports
import { CookieService } from 'ngx-cookie-service'
// This Module Imports
import { CookiesKeys } from '../../models'
import { AuthenticationStore } from '../../stores'

export const isLogged: CanActivateFn = () => {
  // console.log('[Guard] isLogged'))
  const router = inject(Router)
  const authenticationStore = inject(AuthenticationStore)
  const cookiesService = inject(CookieService)

  // Check if the code is running in the browser
  const isBrowser = typeof window !== 'undefined'
  if (!isBrowser) return false

  const accessToken: string = cookiesService.get(CookiesKeys.accessToken)
  const refreshToken: string = cookiesService.get(CookiesKeys.refreshToken)

  if (accessToken && refreshToken) {
    if (!authenticationStore.logged()) {
      authenticationStore.signin({ accessToken, refreshToken })
    }
    return true
  } else {
    console.error(
      `The value of the accessToken (${accessToken}) and the refreshToken (${refreshToken}) is not a valid one`,
    )

    if (authenticationStore.logged()) {
      authenticationStore.signout()
    }
    router.navigate(['/signin'])
    return false
  }
}
