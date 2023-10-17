import * as api from './api';
import * as country from './country';
import * as locales from './locales';
import * as session from './session';
import app from '~/lib/app/index';
import Ema from '~/lib/app/Ema';
export * from './types';
export * from './global';
export { api, country, locales, session, Ema };

export const OTHER_OPTION = '_other';

export function extendOptionsList (list?: app.Option[], options?: {
  empty?: boolean;
  other?: boolean;
}): app.Option[] {
  list = list ?? [];
  if (options?.empty) {
    list.splice(0, 0,
      { value: undefined, textKey: 'internal.empty_option' },
    );
  }
  if (options?.other) {
    list.push({
      value: OTHER_OPTION,
      textKey: 'internal.other_option',
    });
  }
  return list;
}

export function internalOptionsList (
  countryData: undefined | app.session.CountryData,
  name: string,
): app.Option[] {
  const list = countryData?.internalLists?.[name];
  if (!list) return [];
  return list.options.map(value => ({
    value,
    textKey: `app.internal_lists.${name}.${value}`,
  }));
}

export function internalOptionsList2 (
  countryData: app.Maybe<app.session.CountryData>,
  name: string,
): app.List<app.OptionItem<string>> {
  const options = countryData?.internalLists?.[name]?.options ?? [];
  return options.map(value => ({
    value,
    item: `app.internal_lists.${name}.${value}`,
  }));
}
