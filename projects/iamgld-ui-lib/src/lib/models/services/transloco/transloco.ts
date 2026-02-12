export const TRANSLOCO_LANGUAGE_KEYS = {
  spanish: 'es',
  english: 'en',
} as const;

export type TranslocoLanguageKey = typeof TRANSLOCO_LANGUAGE_KEYS[keyof typeof TRANSLOCO_LANGUAGE_KEYS];

export const TRANSLOCO_LANGUAGE_NAMES = {
  spanish: 'spanish',
  english: 'english',
} as const;

export type TranslocoLanguageName = typeof TRANSLOCO_LANGUAGE_NAMES[keyof typeof TRANSLOCO_LANGUAGE_NAMES];
