// Angular Imports
import { computed, inject } from '@angular/core'
import { HttpInterceptorFn, HttpHandlerFn, HttpRequest } from '@angular/common/http'
// Thirdparty Imports
import { AuthStore } from '@ui/stores'

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
