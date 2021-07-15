import * as mappers from './mappers';
import { ApiRequest, Params, query } from '.';
import { AssociatedRecord, AssociatedRecordsIndex, createAssociationsMapper } from './mappers';

const { object, record, recordId, prop, maybeProp, assoc, val } = mappers;

interface User {
  id: number;
  login: string;
  full_name?: string;
  country: AssociatedRecord;
}

interface Associations {
  country: AssociatedRecordsIndex,
}

function mapUser (value: any, associations?: Associations): User {
  return object(value, root => ({
    id: recordId(root),
    login: prop('login', root, val.string),
    full_name: maybeProp('full_name', root, val.string),
    country: assoc('country', root, associations?.country),
  }));
}

const mapAssociations = createAssociationsMapper<Associations>('country');

export function search (request: ApiRequest, params: Params) {
  return query({
    path: '/users/search',
    data: params,
    request,
    mapper: payload => mappers.paginatedRecords(payload, mapUser, mapAssociations),
  });
}

export function get (request: ApiRequest, userId: number) {
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

export function update (request: ApiRequest, userId: number, user: Params) {
  return query({
    path: `/users/${userId}/update`,
    data: { user },
    request,
    mapper: mappers.changedRecord,
  });
}
