// Angular Imports
import { Injectable, inject } from '@angular/core'
import { Environment, EnvironmentType } from '../../models'
// This Module Imports
import { SERVICES_ENVIRONMENT } from '../services-environment.token'

@Injectable()
export class EnvironmentsService {
  private readonly environment = inject<Environment>(SERVICES_ENVIRONMENT)

  public getEnvironment(): Environment {
    return this.environment
  }

  public getEnvironmentLabel(): EnvironmentType {
    return this.environment.environmentType
  }
}
