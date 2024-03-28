import app from '~/lib/app';
import { formatISO } from 'date-fns';
import { intersectionWith } from 'lodash';

export function valuesForRecord (
  record: app.Map<unknown>,
  definition: app.Map<(value: unknown) => unknown>,
) {
  const values: app.Map<unknown> = {};
  const props = Object.keys(definition);
  for (const prop of props) {
    let value = definition[prop]?.(record[prop]);
    if (value === '' || (Array.isArray(value) && value.length === 0)) {
      value = undefined;
    }
    if (value !== undefined) {
      values[prop] = value;
    }
  }
  return values;
}
export function valuesToParams (
  values: app.Map<unknown>,
  definition: app.Map<(value: unknown) => unknown>,
) {
  const params: app.Map<unknown> = {};
  const props = Object.keys(definition);
  for (const prop of props) {
    if (prop in values && definition[prop]) {
      const value = definition[prop]?.(values[prop]);
      params[prop] = value;
    }
  }
  return params;
}

export function valueForOption (
  value,
  options: app.OptionItemsList<string>,
): app.Maybe<app.OptionItem<string>[]> {
  if (!options) return;
  const option = options.find(item => item.value === value);
  return option ? [ option ] : undefined;
}

export function valueForOptions (
  value,
  options: app.OptionItemsList<string>,
): app.Maybe<app.OptionItem<string>[]> {
  if (!options || !value?.length) return;
  const selected = intersectionWith(
    options,
    value,
    (item, value) => item.value === value,
  );
  return selected.length ? selected : undefined;
}

export function valueForOptionOrFill (
  value,
  options: app.OptionItemsList<string>,
): undefined
  | [ app.OptionItem<string> ]
  | [ app.OptionItem<string>, app.Maybe<string> ] {
  if (!options) return;
  const selectedValue = value?.[0];
  const option = options.find(item => item.value === selectedValue);
  if (!option) return;
  if (option?.value === '_other') {
    return [ option, value[1] ];
  } else {
    return [ option ];
  }
}

export function optionToParam (value): string {
  return value?.[0]?.value ?? '';
}

export function optionOrFillToParam (
  value,
): [string, app.Maybe<string>] {
  return [ value?.[0]?.value ?? '', value?.[1] ];
}

export function optionsToParam (value): string[] {
  return value?.map(item => item.value) ?? [];
}

export function dateToParam (value): string {
  return value
    ? formatISO(value, { representation: 'date' })
    : '';
}
