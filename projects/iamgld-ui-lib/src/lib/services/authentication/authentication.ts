// Angular Imports
import { HttpClient } from '@angular/common/http'
import { computed, Injectable, inject } from '@angular/core'
import { Router } from '@angular/router'
// Thirdparty Imports
import { catchError, map, Observable, throwError } from 'rxjs'
import { Environment } from '../../models'
import { AuthenticationStore } from '../../stores'
// This Module Imports
import { SERVICES_ENVIRONMENT_TOKEN } from '../services-environment-token'
import { RefreshAccessTokenResponse, SigninResponse } from './authentication-adapter'

@Injectable()
export class Authentication {
  private readonly environment = inject<Environment>(SERVICES_ENVIRONMENT_TOKEN)
  private readonly router = inject(Router)
  private readonly http = inject(HttpClient)
  private readonly authenticationStore = inject(AuthenticationStore)

  private readonly iamgldApi = computed(() => this.environment.iamgldApi)

  public signin(parameters: { email: string; password: string }): Observable<void> {
    const { email, password } = parameters

    const url = `${this.iamgldApi()}/v1/auth/signin`

    const payload = {
      email,
      password,
    }

    return this.http.post<SigninResponse>(url, payload).pipe(
      map((response) => {
        if (response && response.accessToken && response.refreshToken) {
          this.authenticationStore.signin({
            accessToken: response.accessToken,
            refreshToken: response.refreshToken,
          })
        } else {
          throw new Error(
            'An unexpected error occurred when we were trying to hit this api - signin',
          )
        }
      }),
    )
  }

  public refreshAccessToken(parameters: { refreshToken: string }): Observable<void> {
    const { refreshToken } = parameters

    const url = `${this.iamgldApi()}/v1/auth/refresh`

    const payload = {
      refreshToken,
    }

    return this.http.post<RefreshAccessTokenResponse>(url, payload).pipe(
      catchError((error) => {
        if (
          error &&
          error.error &&
          error.error.statusCode === 401 &&
          error.error.message === 'jwt expired'
        ) {
          // console.log('logout')
          this.authenticationStore.signout()
          this.router.navigate(['/signin'])
          return throwError(() => new Error('Session expired. Please log in again.'))
        }

        return throwError(() => error)
      }),
      map((response) => {
        if (response && response.accessToken && response.refreshToken) {
          this.authenticationStore.signin({
            accessToken: response.accessToken,
            refreshToken: response.refreshToken,
            saveCookie: false,
          })
        } else {
          this.authenticationStore.signout()
          this.router.navigate(['/signin'])
          throw new Error(
            'An unexpected error occurred when we were trying to hit this api - refreshAccessToken',
          )
        }
      }),
    )
  }
}
