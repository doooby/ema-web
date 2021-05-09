/* eslint-disable camelcase */
export namespace Prop {
  export type Object = { [prop: string]: any };
  export type Id = number;
  export type String = string;
  export type Integer = number;
  export type Bool = boolean;
}

export type RecordErrors = Array<[ string, string ]>;

export interface ResourceChange {
  success: boolean;
  errors?: RecordErrors;
}

export interface Pagination {
  total: number;
  page: number;
  per_page: number;
  pages_count: number;
}

export interface PaginatedRecords<R> {
  list: R[];
  pagination: Pagination;
}

export const mappers = {
  object<R> (value: any, parser: (object: Prop.Object) => R): R {
    if (typeof value !== 'object') throw new Error('invalid object');
    return parser(value);
  },
  changedRecord (value: any): ResourceChange {
    return mappers.object<ResourceChange>(value, object => ({
      success: mappers.boolean(object.success),
      errors: mappers.array(
        object.errors, error => mappers.tuple(error, tuple => [
          mappers.nonEmptyString(tuple[0]), mappers.nonEmptyString(tuple[1]),
        ]),
      ),
    }));
  },
  array<I> (value: any, parser: (object: any) => I): I[] {
    if (typeof value !== 'object' || typeof value.map !== 'function') throw new Error('invalid array');
    return value.map((item: any) => mappers.object(item, parser));
  },
  tuple<I> (value: any[], parser: (tuple: any[]) => I): I {
    if (typeof value !== 'object' || typeof value.map !== 'function') throw new Error('invalid tuple');
    return parser(value);
  },
  pagination (value: any): Pagination {
    return mappers.object<Pagination>(value, object => ({
      total: mappers.integer(object.total),
      page: mappers.integer(object.page),
      per_page: mappers.integer(object.per_page),
      pages_count: mappers.integer(object.pages_count),
    }));
  },
  paginatedRecords<R> (value: any, parser: (object: Prop.Object) => R)
    : PaginatedRecords<R> {
    return mappers.object(value, object => ({
      list: mappers.array(object.list, parser),
      pagination: mappers.pagination(object.pagination),
    }));
  },
  recordId (object: Prop.Object): Prop.Id {
    const value = object.id;
    if (typeof value !== 'number' || isNaN(value)) throw new Error('invalid resource id');
    return value;
  },
  nonEmptyString (value: any): Prop.String {
    if (typeof value !== 'string' || value.length === 0) throw new Error('invalid non-empty string');
    return value;
  },
  integer (value: any): Prop.Integer {
    if (typeof value !== 'number' || isNaN(value)) throw new Error('invalid integer');
    return Math.floor(value);
  },
  boolean (value: any): Prop.Bool {
    return !!value;
  },
};
