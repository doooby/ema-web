import { parseISO as parseDate } from 'date-fns';

type Labels = { [name: string]: undefined | string };

export type RecordError = [ string, string ];

export interface RecordGet<R=any> {
  success: boolean;
  record: R;
}

export interface RecordChange {
  success: boolean;
  record_id?: number;
  errors?: RecordError[];
}

export interface PaginatedRecords<R=any> {
  records: R[];
  total: number;
  page: number;
  pages_count: number;
  per_page: number;
}

export interface AssociatedRecord<R=any> {
  id: number;
  labels: Labels;
  record?: R;
}

export type AssociatedRecordsIndex<R=any> = { [id: string]: undefined | AssociatedRecord<R> }

export class MappingError extends Error {
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

export function unsafeProp<V> (
  name: string,
  parent: { [prop: string]: any },
  defaultValue: V,
  map: (value: any) => V,
): V {
  const value = parent[name];
  if (!value) return defaultValue;

  try {
    return map(value);
  } catch (error) {
    return defaultValue;
  }
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

export function maybeAssoc<A> (
  name: string,
  parent: { [prop: string]: any },
  index?: { [id: string]: undefined | A },
): undefined | A {
  const associateId = maybeAssocId(parent, name);
  const associatedRecord = index && associateId && index[associateId];
  if (associatedRecord) return associatedRecord;
}

export function recordId (parent: any): number {
  const value = parent.id;
  if (typeof value !== 'number') throw new MappingError('invalid record id');
  return value;
}

export function assocId (parent: any, associationName: string): number {
  const propName = `${associationName}_id`;
  const value = parent[propName];
  if (typeof value !== 'number') throw new MappingError(`invalid association id ${propName}`);
  return value;
}

export function maybeAssocId (parent: any, associationName: string): undefined | number {
  const propName = `${associationName}_id`;
  const value = parent[propName];
  return typeof value !== 'number' ? undefined : value;
}

export const val = {
  boolean (value: any): boolean {
    return !!value;
  },
  string (value: any): string {
    if (value === undefined) return '';
    if (typeof value !== 'string') throw new MappingError('invalid string');
    return value;
  },
  integer (value: any): number {
    if (typeof value !== 'number' || isNaN(value)) throw new MappingError('invalid number');
    return Math.round(value);
  },
  date (value: any): Date {
    if (typeof value !== 'string') throw new MappingError('invalid date input');
    const date = parseDate(value);
    if (isNaN(date as any)) throw new MappingError('invalid date');
    return date;
  },
  assoc<R=any> (value: any): AssociatedRecord<R> {
    return object(value, root => ({
      id: recordId(root),
      caption: prop('caption', root, val.string),
      labels: unsafeProp('labels', root, {}, value => recordLabels(value)),
    }));
  },
};

export function record<R, A> (
  value: any,
  mapToRecordParams: (value: any, associations?: A) => R,
  mapAssociations?: (value: any) => A,
): RecordGet<R> {
  return object(value, (root) => {
    const associations = mapAssociations && prop('associations', root, mapAssociations);
    return {
      success: prop('success', root, val.boolean),
      record: prop('record', root, record => mapToRecordParams(record, associations)),
    };
  });
}

export function recordLabels (value: any): Labels {
  return object(value, (root) => {
    const labels: Labels = {};
    for (const [ name, value ] of Object.entries(root)) {
      labels[name] = String(value);
    }
    return labels;
  });
}

export function changedRecord (value: any): RecordChange {
  return object(value, root => ({
    success: prop('success', root, val.boolean),
    record_id: maybeProp('record_id', root, val.integer),
    errors: maybeProp('errors', root, errors => list(errors, error => tuple(error, errorValues => [
      prop('0', errorValues, val.string),
      prop('1', errorValues, val.string),
    ]))),
  }));
}

export function paginatedRecords<R, A> (
  value: any,
  mapToRecordParams: (value: any, associations?: A) => R,
  mapAssociations?: (value: any) => A,
): PaginatedRecords<R> {
  return object(value, (root) => {
    const associations = mapAssociations && prop('associations', root, mapAssociations);
    const records = prop('records', root, records => list(
      records,
      item => mapToRecordParams(item, associations),
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

export function associatedRecords<R> (value: any): { records: AssociatedRecord<R>[] } {
  return object(value, root => ({
    records: prop('records', root, records => list(records, val.assoc)),
  }));
}

export function createAssociationsMapper<A> (...names: string[]) {
  return function (value: any): A {
    return object(value, (root) => {
      const associations_index = {} as any;
      for (const name of names) {
        associations_index[name] = prop(name, root, records => index(records, val.assoc));
      }
      return associations_index as A;
    });
  };
}
