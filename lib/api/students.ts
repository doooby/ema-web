import * as mappers from './mappers';
import { ApiRequest, Params, query } from '.';
import { AssociatedCountry, mapAssociatedCountry } from './associations/country';

const { object, record, recordId, prop, index, assoc, val } = mappers;

export interface Student {
  id: number;
  full_name: string;
  country: AssociatedCountry;
}

interface Associations {
  country: { [id: string]: undefined | AssociatedCountry },
}

function mapStudent (value: any, associations?: Associations): Student {
  return object(value, root => ({
    id: recordId(root),
    full_name: prop('full_name', root, val.string),
    country: assoc('country', root, associations?.country),
  }));
}

function mapAssociations (value: any): Associations {
  return object(value, root => ({
    country: prop('country', root, countries => index(countries, mapAssociatedCountry)),
  }));
}

export function search (request: ApiRequest, params: Params) {
  return query({
    path: '/students/search',
    data: params,
    request,
    mapper: payload => mappers.paginatedRecords(payload, mapStudent, mapAssociations),
  });
}

export function get (request: ApiRequest, studentId: number) {
  return query({
    path: `/students/${studentId}`,
    request,
    mapper: payload => record(payload, mapStudent, mapAssociations),
  });
}

export function create (request: ApiRequest, student: Params) {
  return query({
    path: '/students/create',
    data: { student },
    request,
    mapper: mappers.changedRecord,
  });
}

export function update (request: ApiRequest, studentId: number, student: Params) {
  return query({
    path: `/students/${studentId}/update`,
    data: { student },
    request,
    mapper: mappers.changedRecord,
  });
}
