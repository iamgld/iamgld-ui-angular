// Angular Imports
import { inject, Injectable } from '@angular/core'
// This Module Imports
import { SERVICES_ENVIRONMENT } from '../services-environment.token'
// Thirdparty Imports
import { Environment, EnvironmentType } from '@ui/models'

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
