// Angular Imports
import { inject } from '@angular/core'
import { HttpInterceptorFn, HttpHandlerFn, HttpRequest, HttpParams } from '@angular/common/http'
// Thirdparty Imports
import { TranslocoLanguageKey, TranslocoLanguageName } from '@ui/models'
import { TranslocoService } from '@ui/services'

export const changeLanguageInterceptor: HttpInterceptorFn = (
  request: HttpRequest<unknown>,
  next: HttpHandlerFn,
) => {
  const translocoService = inject(TranslocoService)

  let cloneRequest: HttpRequest<unknown> = request

  if (request.headers.has('Language')) {
    if (request.method.toLowerCase() === 'get') {
      let language = TranslocoLanguageName.english

      switch (translocoService.getLanguage()) {
        case TranslocoLanguageKey.english:
          language = TranslocoLanguageName.english
          break
        case TranslocoLanguageKey.spanish:
          language = TranslocoLanguageName.spanish
          break
        default:
          language = TranslocoLanguageName.english
          break
      }

      const params = new HttpParams({ fromObject: { language } })
      // const headers = request.headers.set('Language', language)
      const headers = request.headers.delete('Language')
      cloneRequest = request.clone({ headers, params })
    }
  }

  return next(cloneRequest)
}
