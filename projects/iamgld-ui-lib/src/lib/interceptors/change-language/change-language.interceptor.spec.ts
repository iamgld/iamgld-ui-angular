import { HttpInterceptorFn } from '@angular/common/http'
import { TestBed } from '@angular/core/testing'

import { changeLanguageInterceptor } from './change-language.interceptor'

describe('changeLanguageInterceptor', () => {
  const interceptor: HttpInterceptorFn = (req, next) =>
    TestBed.runInInjectionContext(() => changeLanguageInterceptor(req, next))

  beforeEach(() => {
    TestBed.configureTestingModule({})
  })

  it('should be created', () => {
    expect(interceptor).toBeTruthy()
  })
})
