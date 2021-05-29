import {
  object,
  prop,
  maybeProp,
  assoc,
  index,
  val,
  recordId,
  paginatedRecords,
  record,
  changedRecord,
} from './mappers';
import { ApiRequest, Params, query } from '.';

interface Country {
  id: number;
  designation: string;
}

interface User {
  id: number;
  login: string;
  full_name?: string;
  country: Country;
}

interface Associations {
  country: { [id: string]: undefined | Country },
}

function mapUser (value: any, associations?: Associations): User {
  return object(value, root => ({
    id: recordId(root),
    login: prop('login', root, val.string),
    full_name: maybeProp('full_name', root, val.string),
    country: assoc('country', root, associations?.country),
  }));
}

function mapCountry (value: any): Country {
  return object(value, root => ({
    id: recordId(root),
    designation: prop('designation', root, val.string),
  }));
}

function mapAssociations (value: any): Associations {
  return object(value, root => ({
    country: prop('country', root, countries => index(countries, mapCountry)),
  }));
}

export function search (request: ApiRequest, params: Params) {
  return query({
    path: '/users/search',
    data: params,
    request,
    mapper: payload => paginatedRecords(payload, mapUser, mapAssociations),
  });
}

export function get (request: ApiRequest, userId: number) {
  return query({
    path: `/users/${userId}`,
    request,
    mapper: payload => record(payload, mapUser),
  });
}

export function create (request: ApiRequest, user: Params) {
  return query({
    path: '/users/create',
    data: { user },
    request,
    mapper: changedRecord,
  });
}

export function update (request: ApiRequest, userId: number, user: Params) {
  return query({
    path: `/users/${userId}/update`,
    data: { user },
    request,
    mapper: changedRecord,
  });
}
