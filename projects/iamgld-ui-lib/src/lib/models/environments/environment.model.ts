export interface Environment {
  environmentType: EnvironmentType
  production: boolean
  iamgldApi: string
  cloudflareIamgldAssetsBucket: string
}

export enum EnvironmentType {
  production = 'production',
  staging = 'staging',
  development = 'development',
  local = 'local',
}
