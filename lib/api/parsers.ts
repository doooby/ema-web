export namespace Prop {
  export type Object = { [prop: string]: any };
  export type Id = number;
  export type String = string;
  export type Integer = number;
}

export interface Pagination {
  total: number;
  page: number;
  perPage: number;
  pagesCount: number;
}

export interface PaginatedRecords<R> {
  list: R[];
  pagination: Pagination;
}

export const parsers = {
  record<R> (value: any, parser: (object: Prop.Object) => R): R {
    if (typeof value !== 'object') throw new Error('invalid object');
    return parser(value);
  },
  records<R> (value: any, parser: (object: Prop.Object) => R): R[] {
    if (typeof value !== 'object' || typeof value.map !== 'function') throw new Error('invalid array');
    return value.map((item: any) => parsers.record(item, parser));
  },
  pagination (value: any): Pagination {
    return parsers.record<Pagination>(value, object => ({
      total: parsers.integer(object.total),
      page: parsers.integer(object.page),
      perPage: parsers.integer(object.perPage),
      pagesCount: parsers.integer(object.pagesCount),
    }));
  },
  paginatedRecords<R> (value: any, parser: (object: Prop.Object) => R)
  : PaginatedRecords<R> {
    return parsers.record(value, object => ({
      list: parsers.records(object.list, parser),
      pagination: parsers.pagination(object.pagination),
    }));
  },
  recordId (object: Prop.Object): Prop.Id {
    const value = object.id;
    if (typeof value !== 'number' || isNaN(value)) throw new Error('invalid record id');
    return value;
  },
  nonEmptyString (object: Prop.Object, propName: any): Prop.String {
    const value: any = object[propName];
    if (typeof value !== 'string' || value.length === 0) throw new Error(`invalid non-empty string ${propName}`);
    return value;
  },
  integer (value: any): Prop.Integer {
    if (typeof value !== 'number' || isNaN(value)) throw new Error('invalid integer');
    return Math.floor(value);
  },
};
