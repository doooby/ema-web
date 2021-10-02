import { fetchLocales } from '~/lib/api/session';

export default async (context, locale) => {
  return await fetchLocales(locale, { baseUrl: context.$config.apiBaseUrl });
};
