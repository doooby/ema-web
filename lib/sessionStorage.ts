import { warnOfError } from '~/lib/global_utils';
import { wai } from '~/vendor/wai';

const store = globalThis.sessionStorage;

export const values = {
  pageData: {
    forPage (path) {
      return {
        key: `EMA--pageData|${path}`,
        mapper: value => value as unknown,
      };
    },
  },
};

interface StoredValue<V> {
  key: string;
  mapper(value): V;
}

export function get<V> ({ key, mapper }: StoredValue<V>): null | V {
  if (!store) return null;
  const [ error, value ] = wai.tryParse(
    store.getItem(key),
    value => value ? mapper(JSON.parse(value)) : null,
  );
  if (error) {
    warnOfError(error, 'localStorage.get', key);
    return null;
  } else {
    return value ?? null;
  }
}

export function set (
  { key }: Pick<StoredValue<any>, 'key'>,
  value: any = undefined,
): void {
  if (!store) return;
  if (value) store.setItem(key, JSON.stringify(value));
  else store.removeItem(key);
}
