// Angular Imports
import { Injectable, inject } from '@angular/core'
import { Environment, EnvironmentType } from '../../models'
// This Module Imports
import { SERVICES_ENVIRONMENT_TOKEN } from '../services-environment-token'

@Injectable()
export class EnvironmentsService {
  private readonly environment = inject<Environment>(SERVICES_ENVIRONMENT_TOKEN)

  public getEnvironment(): Environment {
    return this.environment
  }

  public getEnvironmentLabel(): EnvironmentType {
    return this.environment.environmentType
  }
}
