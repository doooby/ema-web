export type RecordErrors = Array<[ string, string ]>;

export interface RecordChange {
  success: boolean;
  errors?: RecordErrors;
}

export interface PaginatedRecords<R> {
  records: R[];
  total: number;
  page: number;
  pagesCount: number;
  perPage: number;
}

class MappingError extends Error {
  reason: string;
  propTraces: [ string, any ][] = [];

  constructor (message: string) {
    super('api mapping error');
    this.reason = message;
  }

  pushPropTrace (name: string, parent: any) {
    this.propTraces.push([ name, parent ]);
  }

  finalize () {
    const props = this.propTraces.map(([ prop ]) => prop);
    props.push('root');
    props.reverse();
    this.message = `${this.message}: ${this.reason} at ${props.join('.')}`;
  }
}

export function object<V> (value: any, map: (object: { [prop: string]: any }) => V): V {
  if (typeof value !== 'object' || value === null) {
    throw new MappingError('invalid object');
  }
  return map(value);
}

export function list<V> (value: any, map: (list: any) => V): V[] {
  if (typeof value !== 'object' || value === null || typeof value.map !== 'function') {
    throw new MappingError('invalid list');
  }
  return value.map((item: any) => map(item));
}

export function tuple<V> (value: any, map: (items: any[]) => V): V {
  if (typeof value !== 'object' || value === null) throw new MappingError('invalid tuple');
  return map(value);
}

export function prop<V> (name: string, parent: { [prop: string]: any }, map: (value: any) => V): V {
  try {
    return map(parent[name]);
  } catch (error) {
    if (error instanceof MappingError) {
      error.pushPropTrace(name, parent);
    }
    throw error;
  }
}

export function maybeProp<V> (
  name: string,
  parent: { [prop: string]: any },
  map: (value: any) => V,
): undefined | V {
  const value = parent[name];
  if (value === null || typeof value === 'undefined') return undefined;
  return prop(name, parent, map);
}

export function recordId (parent: any): string {
  const value = parent.id;
  if (typeof value !== 'string' || value.length === 0) throw new MappingError('invalid record id');
  return value;
}

export const val = {
  boolean (value: any): boolean {
    return !!value;
  },
  string (value: any): string {
    if (typeof value !== 'string') throw new MappingError('invalid string');
    return value;
  },
  integer (value: any): number {
    if (typeof value !== 'number' || isNaN(value)) throw new MappingError('invalid number');
    return Math.round(value);
  },
};

export function safeMap<T> (value: any, map: (value: any) => T): Error | T {
  try {
    return map(value);
  } catch (error) {
    if (error instanceof MappingError) error.finalize();
    return error;
  }
}

export function changedRecord (value: any): RecordChange {
  return object(value, root => ({
    success: prop('success', root, val.boolean),
    errors: maybeProp('errors', root, errors => list(errors, error => tuple(error, errorValues => [
      prop('0', errorValues, val.string),
      prop('1', errorValues, val.string),
    ]))),
  }));
}

export function paginatedRecords<R> (value: any, record: (value: any) => R): PaginatedRecords<R> {
  return object(value, root => ({
    records: prop('records', root, records => list(records, record)),
    total: prop('total', root, val.integer),
    page: prop('page', root, val.integer),
    pagesCount: prop('pages_count', root, val.integer),
    perPage: prop('per_page', root, val.integer),
  }));
}
