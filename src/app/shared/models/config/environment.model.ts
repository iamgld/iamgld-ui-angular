export interface Environment {
  environmentType: EnvironmentType
  production: boolean
}

export enum EnvironmentType {
  production = 'production',
  staging = 'staging',
  development = 'development',
  local = 'local',
}
