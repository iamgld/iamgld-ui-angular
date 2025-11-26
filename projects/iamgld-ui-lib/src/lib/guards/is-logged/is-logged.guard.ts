// Angular Imports
import { inject } from '@angular/core'
import { CanActivateFn, Router } from '@angular/router'
// Thirdparty Imports
import { CookiesKeys } from '@ui/models'
import { AuthStore } from '@ui/stores'
import { CookieService } from 'ngx-cookie-service'

export const isLoggedGuard: CanActivateFn = () => {
  // console.log('[Guard] isLoggedGuard')
  const router = inject(Router)
  const authStore = inject(AuthStore)
  const cookiesService = inject(CookieService)

  // Check if the code is running in the browser
  const isBrowser = typeof window !== 'undefined'
  if (!isBrowser) return false

  const accessToken: string = cookiesService.get(CookiesKeys.accessToken)
  const refreshToken: string = cookiesService.get(CookiesKeys.refreshToken)

  if (accessToken && refreshToken) {
    if (!authStore.logged()) {
      authStore.signin({ accessToken, refreshToken })
    }
    return true
  } else {
    console.error(
      `The value of the accessToken (${accessToken}) and the refreshToken (${refreshToken}) is not a valid one`,
    )

    if (authStore.logged()) {
      authStore.signout()
    }
    router.navigate(['/signin'])
    return false
  }
}
