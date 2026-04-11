export const TILE_COLORS = {
  default: 'default',
  pink: 'pink',
  purple: 'purple',
  mustard: 'mustard',
  orange: 'orange',
  red: 'red',
  blue: 'blue',
  green: 'green',
} as const;

export type TileColor = typeof TILE_COLORS[keyof typeof TILE_COLORS];

export const TILE_PADDING_SIZES = {
  zero: 'zero',
  tiny: 'tiny',
  small: 'small',
  normal: 'normal',
  medium: 'medium',
  large: 'large',
} as const;

export type TilePaddingSize = typeof TILE_PADDING_SIZES[keyof typeof TILE_PADDING_SIZES];
