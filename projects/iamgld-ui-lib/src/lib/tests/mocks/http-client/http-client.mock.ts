// Angular Imports
import { HttpClient } from '@angular/common/http'

export const mockHttpClient: Partial<jest.Mocked<HttpClient>> = {
  get: jest.fn(),
  post: jest.fn(),
  put: jest.fn(),
  delete: jest.fn(),
}
