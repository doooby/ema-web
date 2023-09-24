import { wai } from '~/vendor/wai';

// remove
export function prop<V> (
  name: number | string,
  parent: wai.Object,
  map: (value) => V,
): V {
  try {
    return map(parent[name]);
  } catch (error) {
    if (error instanceof wai.MappingError) {
      error.addPropertyTrace(name, parent);
    }
    throw error;
  }
}

export function property<V> (
  parent: wai.Object,
  name: number | string,
  mapValue: (value) => V,
): V {
  try {
    return mapValue(parent[name]);
  } catch (error) {
    if (error instanceof wai.MappingError) {
      error.addPropertyTrace(name, parent);
    }
    throw error;
  }
}
