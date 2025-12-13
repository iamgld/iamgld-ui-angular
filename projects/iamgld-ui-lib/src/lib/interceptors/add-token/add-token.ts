// Angular Imports

import { HttpHandlerFn, HttpInterceptorFn, HttpRequest } from '@angular/common/http'
import { computed, inject } from '@angular/core'
// This Module Imports
import { AuthenticationStore } from '../../stores'

export const addToken: HttpInterceptorFn = (
  request: HttpRequest<unknown>,
  next: HttpHandlerFn,
) => {
  const authenticationStore = inject(AuthenticationStore)
  const logged = computed(() => authenticationStore.logged())
  const accessToken = computed(() => authenticationStore.accessToken())

  let cloneRequest: HttpRequest<unknown> = request

  if (logged() && request.headers.has('Authorization')) {
    cloneRequest = request.clone({
      headers: request.headers.set('Authorization', `Bearer ${accessToken()}`),
    })
  }

  return next(cloneRequest)
}
