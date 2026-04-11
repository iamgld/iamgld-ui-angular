// Angular Imports
import { InjectionToken } from '@angular/core'
// This Module Imports
import { Environment } from '../models'

export const SERVICES_ENVIRONMENT_TOKEN = new InjectionToken<Environment>('services-environment-token')
