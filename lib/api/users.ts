import * as mappers from './mappers';
import { ApiRequest, Params, query } from '.';
import { AssociatedCountry, mapAssociatedCountry } from './shared/associatedCountry';

const { object, record, recordId, prop, maybeProp, index, assoc, val } = mappers;

interface User {
  id: string;
  login: string;
  full_name?: string;
  country: AssociatedCountry;
}

interface Associations {
  country: { [id: string]: undefined | AssociatedCountry },
}

function mapUser (value: any, associations?: Associations): User {
  return object(value, root => ({
    id: recordId(root),
    login: prop('login', root, val.string),
    full_name: maybeProp('full_name', root, val.string),
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
    path: '/users/search',
    data: params,
    request,
    mapper: payload => mappers.paginatedRecords(payload, mapUser, mapAssociations),
  });
}

export function get (request: ApiRequest, userId: string) {
  return query({
    path: `/users/${userId}`,
    request,
    mapper: payload => record(payload, mapUser, mapAssociations),
  });
}

export function create (request: ApiRequest, user: Params) {
  return query({
    path: '/users/create',
    data: { user },
    request,
    mapper: mappers.changedRecord,
  });
}

export function update (request: ApiRequest, userId: string, user: Params) {
  return query({
    path: `/users/${userId}/update`,
    data: { user },
    request,
    mapper: mappers.changedRecord,
  });
}
