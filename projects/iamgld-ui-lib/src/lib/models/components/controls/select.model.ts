export const SELECT_TYPES = {
  default: 'default',
  inline: 'inline',
} as const;

export type SelectType = typeof SELECT_TYPES[keyof typeof SELECT_TYPES];
