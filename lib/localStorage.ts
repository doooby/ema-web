const store = globalThis.localStorage;

export const values = {
  currentCountryId: {
    key: 'EMA--currentCountryId',
    mapper: value => value,
  },
};

interface StoredValue<V> {
  key: string;
  mapper(value: string): V;
}

export function get<V> ({ key, mapper }: StoredValue<V>): null | V {
  if (!store) return null;
  let value = store.getItem(key);
  try {
    value = value && JSON.parse(value);
  } catch (error) {
    value = null;
  }
  if (!value) return null;
  return mapper(value);
  // let result;
  // try {
  //   result = mapper(value);
  // } catch (error) {
  //   if (error instanceof mappers.MappingError) error.finalize();
  //   else throw error;
  //   console.error(error);
  //   return null;
  // }
  // return result;
}

export function set ({ key }: StoredValue<any>, value: any): void {
  if (!store) return;
  if (value) store.setItem(key, JSON.stringify(value));
  else store.removeItem(key);
}
