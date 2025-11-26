// This Component Imports
import { EnvironmentsService } from './environments.service'
import { SERVICES_ENVIRONMENT } from '../services-environment.token'
// Thirdparty Imports
import { mockEnvironment } from '@ui/tests'
import { createServiceFactory, SpectatorService } from '@ngneat/spectator/jest'

describe('EnvironmentsService', () => {
  let spectator: SpectatorService<EnvironmentsService>
  const createService = createServiceFactory({
    service: EnvironmentsService,
    providers: [{ provide: SERVICES_ENVIRONMENT, useValue: mockEnvironment }],
  })

  beforeEach(() => {
    spectator = createService()
    jest.clearAllMocks()
    jest.restoreAllMocks()
  })

  test('should create the service when initialized', () => {
    expect(spectator.service).toBeTruthy()
  })

  test('should return the environment when getEnvironment is called', () => {
    expect(spectator.service.getEnvironment()).toBe(mockEnvironment)
  })

  test('should return the environmentType when getEnvironmentLabel is called', () => {
    expect(spectator.service.getEnvironmentLabel()).toBe(mockEnvironment.environmentType)
  })

  test('should return the iamgldApi when getEnvironment is called', () => {
    expect(spectator.service.getEnvironment().iamgldApi).toBe(mockEnvironment.iamgldApi)
  })

  test('should return the cloudflareIamgldAssetsBucket when getEnvironment is called', () => {
    expect(spectator.service.getEnvironment().cloudflareIamgldAssetsBucket).toBe(
      mockEnvironment.cloudflareIamgldAssetsBucket,
    )
  })
})
