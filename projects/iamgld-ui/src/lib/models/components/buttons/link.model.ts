export const LINK_TYPES = {
  default: 'default',
} as const;

export type LinkType = typeof LINK_TYPES[keyof typeof LINK_TYPES];

export const LINK_ALIGNS = {
  left: 'left',
  right: 'right',
  center: 'center',
} as const;

export type LinkAlign = typeof LINK_ALIGNS[keyof typeof LINK_ALIGNS];
