// Angular Imports
import { HttpEvent, HttpHandlerFn, HttpInterceptorFn, HttpRequest } from '@angular/common/http'
import { computed, inject, signal } from '@angular/core'
// Thirdparty Imports
import { catchError, Observable, Subject, switchMap, throwError } from 'rxjs'
// This Module Imports
import { AuthService } from '../../services'
import { AuthStore } from '../../stores'

export const refreshTokenInterceptor: HttpInterceptorFn = (
  request: HttpRequest<unknown>,
  next: HttpHandlerFn,
) => {
  const authStore = inject(AuthStore)
  const authService = inject(AuthService)
  const logged = computed(() => authStore.logged())
  const accessToken = computed(() => authStore.accessToken())
  const refreshToken = computed(() => authStore.refreshToken())

  const refreshAccessTokenInProgress = signal<boolean>(false)
  const doSameRequestCallStack: Subject<string> = new Subject<string>()

  const handlerRefreshAccessToken = (
    request: HttpRequest<unknown>,
    next: HttpHandlerFn,
  ): Observable<HttpEvent<unknown>> => {
    if (refreshAccessTokenInProgress()) {
      return doSameRequestCallStack.pipe(
        switchMap((newAccessToken: string) => {
          return next(doSameRequestWithNewAccessToken(request, newAccessToken))
        }),
      )
    }

    refreshAccessTokenInProgress.set(true)
    return authService.refreshAccessToken({ refreshToken: refreshToken() }).pipe(
      switchMap(() => {
        refreshAccessTokenInProgress.set(false)
        doSameRequestCallStack.next(accessToken())
        return next(doSameRequestWithNewAccessToken(request, accessToken()))
      }),
    )
  }

  const doSameRequestWithNewAccessToken = (
    request: HttpRequest<unknown>,
    newAccessToken: string,
  ): HttpRequest<unknown> => {
    return request.clone({
      headers: request.headers.set('Authorization', `Bearer ${newAccessToken}`),
    })
  }

  return next(request).pipe(
    catchError((error: unknown) => {
      // console.log('error', error)
      if (logged() && request.headers.has('Authorization')) {
        const errorTyped = error as { status?: number }

        if (errorTyped?.status === 401) {
          console.log('Refreshing access token...')
          return handlerRefreshAccessToken(request, next)
        }

        return throwError(() => error)
      } else {
        return throwError(() => error)
      }
    }),
  )
}
