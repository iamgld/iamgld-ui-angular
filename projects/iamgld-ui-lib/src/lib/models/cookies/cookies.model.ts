export const COOKIES_KEYS = {
  accessToken: 'gld-access-token',
  refreshToken: 'gld-refresh-token',
} as const;

export type CookiesKeys = typeof COOKIES_KEYS[keyof typeof COOKIES_KEYS];
