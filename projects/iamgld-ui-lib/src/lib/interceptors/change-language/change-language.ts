// Angular Imports

import { HttpHandlerFn, HttpInterceptorFn, HttpParams, HttpRequest } from '@angular/common/http'
import { inject } from '@angular/core'
// This Module Imports
import { TranslocoLanguageKey, TranslocoLanguageName } from '../../models'
import { Transloco } from '../../services'

export const changeLanguage: HttpInterceptorFn = (
  request: HttpRequest<unknown>,
  next: HttpHandlerFn,
) => {
  const transloco = inject(Transloco)

  let cloneRequest: HttpRequest<unknown> = request

  if (request.headers.has('Language')) {
    if (request.method.toLowerCase() === 'get') {
      let language = TranslocoLanguageName.english

      switch (transloco.getLanguage()) {
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
