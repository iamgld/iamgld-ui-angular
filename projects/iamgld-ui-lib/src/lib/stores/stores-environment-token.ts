// Angular Imports
import { InjectionToken } from '@angular/core'
// This Module Imports
import { Environment } from '../models'

export const STORES_ENVIRONMENT_TOKEN = new InjectionToken<Environment>('stores-environment-token')
