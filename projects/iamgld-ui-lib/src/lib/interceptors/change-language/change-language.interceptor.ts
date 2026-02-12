// Angular Imports

import { HttpHandlerFn, HttpInterceptorFn, HttpParams, HttpRequest } from '@angular/common/http'
import { inject } from '@angular/core'
// This Module Imports
import { TRANSLOCO_LANGUAGE_KEYS, TRANSLOCO_LANGUAGE_NAMES, TranslocoLanguageName } from '../../models'
import { Transloco } from '../../services'

export const changeLanguage: HttpInterceptorFn = (
  request: HttpRequest<unknown>,
  next: HttpHandlerFn,
) => {
  const transloco = inject(Transloco)

  let cloneRequest: HttpRequest<unknown> = request

  if (request.headers.has('Language')) {
    if (request.method.toLowerCase() === 'get') {
      let language: TranslocoLanguageName = TRANSLOCO_LANGUAGE_NAMES.english

      switch (transloco.getLanguage()) {
        case TRANSLOCO_LANGUAGE_KEYS.english:
          language = TRANSLOCO_LANGUAGE_NAMES.english
          break
        case TRANSLOCO_LANGUAGE_KEYS.spanish:
          language = TRANSLOCO_LANGUAGE_NAMES.spanish
          break
        default:
          language = TRANSLOCO_LANGUAGE_NAMES.english
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
