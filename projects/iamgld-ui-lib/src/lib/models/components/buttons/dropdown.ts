export const DROPDOWN_TYPES = {
  button: 'button',
  iconButton: 'iconButton',
} as const;

export type DropdownType = typeof DROPDOWN_TYPES[keyof typeof DROPDOWN_TYPES];

export const DROPDOWN_DIRECTIONS = {
  left: 'left',
  right: 'right',
} as const;

export type DropdownDirection = typeof DROPDOWN_DIRECTIONS[keyof typeof DROPDOWN_DIRECTIONS];
