// This Module Imports
import { EnvironmentType } from '../../../../models'

interface EnvironmentsServiceMock {
  getEnvironment: jest.Mock
}

export const mockEnvironmentsService: Partial<jest.Mocked<EnvironmentsServiceMock>> = {
  getEnvironment: jest.fn(() => ({
    environmentType: EnvironmentType.staging,
    cloudflareIamgldAssetsBucket: 'https://staging-api.iamgld.dev',
    production: false,
    iamgldApi: 'https://api.iamgld.dev',
  })),
}
