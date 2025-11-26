// This Module Imports
import { Environment, EnvironmentType } from '../../../models'

export const mockEnvironment: Partial<jest.Mocked<Environment>> = {
  environmentType: EnvironmentType.staging,
  production: false,
  iamgldApi: 'https://staging-api.iamgld.dev',
  cloudflareIamgldAssetsBucket: 'https://assets.iamgld.dev',
}
