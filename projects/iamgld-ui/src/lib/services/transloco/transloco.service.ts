// Shared Imports

import { HttpClient } from '@angular/common/http'
import { Injectable, inject } from '@angular/core'
// Thirdparty Imports
import {
  TranslocoService as JsverseTranslocoService,
  type Translation,
  type TranslocoLoader,
} from '@jsverse/transloco'
// This Module Imports
import type { TranslocoLanguageKey } from '../../models'

@Injectable()
export class TranslocoService {
  private readonly translocoService = inject(JsverseTranslocoService)

  public changeLanguage(language: TranslocoLanguageKey) {
    this.translocoService.setActiveLang(language)
  }

  public getLanguage(): TranslocoLanguageKey {
    return this.translocoService.getActiveLang() as TranslocoLanguageKey
  }
}

@Injectable()
export class TranslocoHttpLoaderService implements TranslocoLoader {
  private readonly httpClient = inject(HttpClient)

  public getTranslation(lang: string) {
    return this.httpClient.get<Translation>(`public/i18n/${lang}.json`)
  }
}
