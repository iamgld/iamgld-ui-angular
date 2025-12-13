import { Icons } from '../../components/icon/icon'

export enum UiTheme {
  dark = 'theme--dark',
  light = 'theme--light',
  system = 'theme--system',
}

export interface ThemeOption {
  icon: Icons.sunLine | Icons.moonClearLine | Icons.macLine
  label: string
  value: UiTheme
}

export const THEMES: ThemeOption[] = [
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
