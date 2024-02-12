import * as api from './api';
import * as country from './country';
import * as internals from './internals';
import * as locales from './locales';
import * as page from './page';
import * as session from './session';
import app from '~/lib/app/index';
import Ema from '~/lib/app/Ema';
export * from './types';
export * from './global';
export { default as Transaction } from './Transaction';
export {
  api,
  country,
  internals,
  locales,
  page,
  session,
  Ema,
};

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

// deprecated, use `app.internal.Options`
export function internalOptionsList3<I=unknown> (
  vue: Vue,
  name: string,
): app.OptionItem<I>[] {
  const countryData = vue.$store.state.session.country;
  const options = countryData?.internalLists?.[name]?.options ?? [];
  return options.map(value => ({
    value,
    item: `app.internal_lists.${name}.${value}`,
  }));
}

export function nullable<V> (defaultValue?: V): app.Nullable<V> {
  return defaultValue ?? null;
}

export function createRef<V> (defaultValue?: V): app.Ref<V> {
  return { ref: defaultValue };
}
