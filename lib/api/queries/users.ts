import { Params } from '..';
import * as mappers from '../mappers';
import { User, UserAssociations } from '~/lib/records';

const { object, record, recordId, prop, maybeProp, assoc, val } = mappers;

function mapUser (value: any, associations?: UserAssociations): User {
  return object(value, root => ({
    id: recordId(root),
    login: prop('login', root, val.string),
    full_name: maybeProp('full_name', root, val.string),
    country: assoc('country', root, associations?.country),
  }));
}

const mapAssociations = mappers.createAssociationsMapper<UserAssociations>('country');

export function index (params: Params) {
  return {
    path: '/users',
    params,
    mapper: (payload: any) => mappers.paginatedRecords(payload, mapUser, mapAssociations),
  };
}

export function show (userId: number) {
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

export function deleteRecord (userId: number) {
  return {
    method: 'DELETE',
    path: `/users/${userId}`,
    mapper: (payload: any) => object(payload, root => ({
      success: prop('success', root, val.boolean),
    })),
  };
}
