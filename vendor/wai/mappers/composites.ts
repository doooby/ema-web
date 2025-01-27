import { wai } from '~/vendor/wai';

// TODO rename `mapObject`
export function object<T> (map: (value: wai.Object) => T): (value) => T {
  return (value) => {
    wai.throwUnlessIsObject(value);
    return Object.freeze(map(value));
  };
}

// TODO rename `object`
export function object2<T> (value, map: (value: wai.Object) => T): T {
  wai.throwUnlessIsObject(value);
  return Object.freeze(map(value));
}

export function listOf<I> (item: (value) => I): (value) => I[] {
  return (value) => {
    if (!Array.isArray(value)) {
      throw new wai.MappingError('not array');
    }
    const array: any = [];
    for (let i = 0; i < value.length; i += 1) {
      array[i] = wai.property(value, i, item);
    }
    return Object.freeze(array) as I[];
  };
}

export function tuple<V0, V1> (
  map0: (value) => V0,
  map1: (value) => V1,
): (value) => [V0, V1] {
  return (value) => {
    if (!Array.isArray(value)) {
      throw new wai.MappingError('not array');
    }
    const array: any = [];
    array[0] = wai.prop(0, value, map0);
    array[1] = wai.prop(1, value, map1);
    return Object.freeze(array) as [V0, V1];
  };
}

export function indexOf<I> (item: (value) => I): (value) => Record<string, I> {
  return wai.object((value) => {
    for (const key of Object.keys(value)) {
      try {
        value[key] = item(value[key]);
      } catch (error) {
        if (error instanceof wai.MappingError) {
          error.addPropertyTrace(key, parent);
        }
        throw error;
      }
    }
    return value;
  });
}

export function listOfStrings (value): string[] {
  return wai.listOf(
    value => wai.nullable(wai.string)(value) ?? '',
  )(value);
}
