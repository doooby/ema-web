export type RecordError = [ string, string ];

export interface RecordGet<R> {
  success: boolean;
  record: R;
}

export interface RecordChange {
  success: boolean;
  errors?: RecordError[];
}

export interface PaginatedRecords<R> {
  records: R[];
  total: number;
  page: number;
  pages_count: number;
  per_page: number;
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
  return Object.freeze(map(value));
}

export function list<V> (value: any, map: (item: any) => V): V[] {
  if (typeof value !== 'object' || value === null || typeof value.map !== 'function') {
    throw new MappingError('invalid list');
  }
  return Object.freeze(value.map((item: any) => map(item)));
}

export function tuple<V> (value: any, map: (items: any[]) => V): V {
  if (typeof value !== 'object' || value === null) throw new MappingError('invalid tuple');
  return Object.freeze(map(value));
}

export function index<V extends { id: any }> (value: any, map: (item: any) => V): { [id: string]: undefined | V } {
  if (typeof value !== 'object' || value === null || typeof value.map !== 'function') {
    throw new MappingError('invalid index-able list');
  }
  const items = list(value, map);
  const index: { [id: string]: undefined | V } = {};
  for (const item of items) index[item.id] = item;
  return index;
}

export function prop<V> (
  name: string,
  parent: { [prop: string]: any },
  map: (value: any) => V,
): V {
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

export function assoc<A> (
  name: string,
  parent: { [prop: string]: any },
  index?: { [id: string]: undefined | A },
): A {
  const associateId = assocId(parent, name);
  const associatedRecord = index && index[associateId];
  if (!associatedRecord) throw new MappingError(`association ${name}[${associateId}] not found`);
  return associatedRecord;
}

export function recordId (parent: any): string {
  const value = parent.id;
  if (typeof value !== 'string') throw new MappingError('invalid record id');
  return value;
}

export function assocId (parent: any, associationName: string): number {
  const propName = `${associationName}_id`;
  const value = parent[propName];
  if (typeof value !== 'number') throw new MappingError(`invalid association id ${propName}`);
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

export function record<R, A> (
  value: any,
  mapRecord: (value: any, associations?: A) => R,
  mapAssociations?: (value: any) => A,
): RecordGet<R> {
  return object(value, (root) => {
    const associations = mapAssociations && prop('associations', root, mapAssociations);
    return {
      success: prop('success', root, val.boolean),
      record: prop('record', root, record => mapRecord(record, associations)),
    };
  });
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

export function paginatedRecords<R, A> (
  value: any,
  mapRecord: (value: any, associations?: A) => R,
  mapAssociations?: (value: any) => A,
): PaginatedRecords<R> {
  return object(value, (root) => {
    const associations = mapAssociations && prop('associations', root, mapAssociations);
    const records = prop('records', root, records => list(
      records,
      item => mapRecord(item, associations),
    ));
    return {
      records,
      total: prop('total', root, val.integer),
      page: prop('page', root, val.integer),
      pages_count: prop('pages_count', root, val.integer),
      per_page: prop('per_page', root, val.integer),
    };
  });
}
