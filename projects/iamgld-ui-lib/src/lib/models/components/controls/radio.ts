export const RADIO_DIRECTIONS = {
  horizontal: 'horizontal',
  vertical: 'vertical',
} as const;

export type RadioDirection = typeof RADIO_DIRECTIONS[keyof typeof RADIO_DIRECTIONS];
