export const BUTTON_COLORS = {
  pink: 'pink',
  purple: 'purple',
  mustard: 'mustard',
  orange: 'orange',
  red: 'red',
  blue: 'blue',
  green: 'green',
} as const;

export type ButtonColor = typeof BUTTON_COLORS[keyof typeof BUTTON_COLORS];

export const BUTTON_SIZES = {
  tiny: 'tiny',
  small: 'small',
  normal: 'normal',
  medium: 'medium',
  large: 'large',
} as const;

export type ButtonSize = typeof BUTTON_SIZES[keyof typeof BUTTON_SIZES];
