// Shared Imports
import { Injectable, inject } from '@angular/core'
import { HttpClient } from '@angular/common/http'
// Thirdparty Imports
import type { TranslocoLanguageKey } from '@ui/models'
import {
  TranslocoService as JsverseTranslocoService,
  type Translation,
  type TranslocoLoader,
} from '@jsverse/transloco'

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
export class TranslocoHttpLoader implements TranslocoLoader {
  private readonly httpClient = inject(HttpClient)

  public getTranslation(lang: string) {
    return this.httpClient.get<Translation>(`assets/i18n/${lang}.json`)
  }
}
