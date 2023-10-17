export const INTL_GLOBAL = 'en-UK';

export const INTERNATIONALIZATION_MAP = {
  en: INTL_GLOBAL,
  cs: 'cs',
  ar: 'ar',
};

export const KNOWN_LOCALES = Object.keys(INTERNATIONALIZATION_MAP);

export function intlLocale (locale: string) {
  return INTERNATIONALIZATION_MAP[locale] ?? INTL_GLOBAL;
}

export function createDateTimeFormat (locale: string, options?: any) {
  return new Intl.DateTimeFormat(intlLocale(locale), options);
}
