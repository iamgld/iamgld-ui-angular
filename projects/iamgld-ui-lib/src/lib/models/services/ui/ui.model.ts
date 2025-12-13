import { Icons } from '@iamgld/ui'

export enum UiTheme {
  dark = 'theme--dark',
  light = 'theme--light',
  system = 'theme--system',
}

export interface Theme {
  icon: Icons.sunLine | Icons.moonClearLine | Icons.macLine
  label: string
  value: UiTheme
}

export const THEMES: Theme[] = [
  {
    label: 'light',
    icon: Icons.sunLine,
    value: UiTheme.light,
  },
  {
    label: 'dark',
    icon: Icons.moonClearLine,
    value: UiTheme.dark,
  },
  {
    label: 'system',
    icon: Icons.macLine,
    value: UiTheme.system,
  },
]
