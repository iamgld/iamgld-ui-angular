import { ICONS, Icons } from '../../components/icon/icon'

export const UI_THEMES = {
  dark: 'theme--dark',
  light: 'theme--light',
  system: 'theme--system',
} as const;

export type UiTheme = typeof UI_THEMES[keyof typeof UI_THEMES];

export interface ThemeOption {
  icon: Icons
  label: string
  value: UiTheme
}

export const THEMES: ThemeOption[] = [
  {
    label: 'light',
    icon: ICONS.sunLine,
    value: UI_THEMES.light,
  },
  {
    label: 'dark',
    icon: ICONS.moonClearLine,
    value: UI_THEMES.dark,
  },
  {
    label: 'system',
    icon: ICONS.macLine,
    value: UI_THEMES.system,
  },
]
