import * as mappers from './mappers';
import { ApiRequest, Params, query } from '.';

const { object, recordId, prop, maybeProp, val } = mappers;

interface User {
  id: number;
  login: string;
  full_name?: string;
}

function mapUser (value: any): User {
  return object(value, root => ({
    id: recordId(root),
    login: prop('login', root, val.string),
    full_name: maybeProp('full_name', root, val.string),
  }));
}

export function search (request: ApiRequest, params: Params) {
  return query({
    path: '/users/search',
    data: params,
    request,
    mapper: payload => mappers.paginatedRecords(payload, mapUser),
  });
}

export function get (request: ApiRequest, userId: number) {
  return query({
    path: `/users/${userId}`,
    request,
    mapper: payload => mappers.record(payload, mapUser),
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

export function update (request: ApiRequest, userId: number, user: Params) {
  return query({
    path: `/users/${userId}/update`,
    data: { user },
    request,
    mapper: mappers.changedRecord,
  });
}
