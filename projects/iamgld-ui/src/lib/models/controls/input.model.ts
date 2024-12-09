export type InputType = 'text' | 'email' | 'password' | 'url' | 'tel' | 'number' | 'search'

export type InputValue =
  | string
  | string[]
  | number
  | number[]
  | boolean
  | boolean[]
  | object
  | object[]
  | Record<string, unknown>
  | Record<string, unknown>[]
  | null
