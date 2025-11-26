// Angular Imports

import { HttpHandlerFn, HttpInterceptorFn, HttpRequest } from '@angular/common/http'
import { computed, inject } from '@angular/core'
// This Module Imports
import { AuthStore } from '../../stores'

export const addTokenInterceptor: HttpInterceptorFn = (
  request: HttpRequest<unknown>,
  next: HttpHandlerFn,
) => {
  const authStore = inject(AuthStore)
  const logged = computed(() => authStore.logged())
  const accessToken = computed(() => authStore.accessToken())

  let cloneRequest: HttpRequest<unknown> = request

  if (logged() && request.headers.has('Authorization')) {
    cloneRequest = request.clone({
      headers: request.headers.set('Authorization', `Bearer ${accessToken()}`),
    })
  }

  return next(cloneRequest)
}
