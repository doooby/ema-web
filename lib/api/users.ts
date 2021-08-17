import * as mappers from './mappers';
import { Params } from '.';
import { AssociatedRecord, AssociatedRecordsIndex, createAssociationsMapper } from './mappers';

const { object, record, recordId, prop, maybeProp, assoc, val } = mappers;

export interface User {
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

export function search (params: Params) {
  return {
    path: '/users/search',
    params,
    mapper: (payload: any) => mappers.paginatedRecords(payload, mapUser, mapAssociations),
  };
}

export function get (userId: number) {
  return {
    path: `/users/${userId}`,
    mapper: (payload: any) => record(payload, mapUser, mapAssociations),
  };
}

export function create (user: Params) {
  return {
    path: '/users/create',
    params: { user },
    mapper: mappers.changedRecord,
  };
}

export function update (userId: number, user: Params) {
  return {
    path: `/users/${userId}/update`,
    params: { user },
    mapper: mappers.changedRecord,
  };
}
