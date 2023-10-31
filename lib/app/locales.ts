export const INTL_GLOBAL = 'en-UK';

const INTERNATIONALIZATION_MAP = {
  en: INTL_GLOBAL,
  cs: 'cs',
  ar: 'ar',
};

const INTERNATIONALIZATION_DATE_MAP = {
  cs: 'cs',
};

export const KNOWN_LOCALES = Object.keys(INTERNATIONALIZATION_MAP);

export const TIME_OPTS = {
  year: 'numeric',
  month: 'numeric',
  day: 'numeric',
  hour: 'numeric',
  minute: 'numeric',
  second: 'numeric',
  timeZoneName: 'short',
};

export function intlLocale (locale: string) {
  return INTERNATIONALIZATION_MAP[locale] ?? INTL_GLOBAL;
}

export function intlDateLocale (locale: string) {
  return INTERNATIONALIZATION_DATE_MAP[locale] ?? INTL_GLOBAL;
}

export function createDateTimeFormat (locale: string, options?: any) {
  return new Intl.DateTimeFormat(intlLocale(locale), options);
}
