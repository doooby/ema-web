import * as country from './country';
import * as session from './session';
import app from '~/lib/app/index';
export * from './types';
export { country, session };

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
