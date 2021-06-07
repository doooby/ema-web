import * as mappers from './mappers';
import { ApiRequest, Params, query } from '.';
import { AssociatedCountry, mapAssociatedCountry } from './shared/associatedCountry';

const { object, record, recordId, prop, maybeProp, index, assoc, val } = mappers;

interface School {
  id: number;
  name: string;
  address?: string;
  country: AssociatedCountry;
}

interface Associations {
  country: { [id: string]: undefined | AssociatedCountry },
}

function mapSchool (value: any, associations?: Associations): School {
  return object(value, root => ({
    id: recordId(root),
    name: prop('name', root, val.string),
    address: maybeProp('address', root, val.string),
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
    path: '/schools/search',
    data: params,
    request,
    mapper: payload => mappers.paginatedRecords(payload, mapSchool, mapAssociations),
  });
}

export function get (request: ApiRequest, schoolId: number) {
  return query({
    path: `/schools/${schoolId}`,
    request,
    mapper: payload => record(payload, mapSchool, mapAssociations),
  });
}

export function create (request: ApiRequest, school: Params) {
  return query({
    path: '/schools/create',
    data: { school },
    request,
    mapper: mappers.changedRecord,
  });
}

export function update (request: ApiRequest, schoolId: number, school: Params) {
  return query({
    path: `/schools/${schoolId}/update`,
    data: { school },
    request,
    mapper: mappers.changedRecord,
  });
}
