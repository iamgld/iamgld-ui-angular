export interface Environment {
	environmentType: EnvironmentType
	production: boolean
}

export const ENVIRONMENT_TYPES = {
	production: 'production',
	staging: 'staging',
	development: 'development',
	local: 'local',
} as const

export type EnvironmentType = (typeof ENVIRONMENT_TYPES)[keyof typeof ENVIRONMENT_TYPES]
