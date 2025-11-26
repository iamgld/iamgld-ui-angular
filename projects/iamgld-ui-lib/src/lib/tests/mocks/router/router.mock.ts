// Angular Imports
import { Router } from '@angular/router'

export const mockRouter: Partial<jest.Mocked<Router>> = {
  navigate: jest.fn(),
}
