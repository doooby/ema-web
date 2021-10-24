import { Params } from '..';
import * as mappers from '../mappers';
import { mapUser, mapUserAssociations } from '~/lib/records';

export function index (params: Params) {
  return {
    path: '/users',
    params,
    mapper: (payload: any) => mappers.paginatedRecords(payload, mapUser, mapUserAssociations),
  };
}

export function show (userId: number) {
  return {
    path: `/users/${userId}`,
    mapper: (payload: any) => mappers.record(payload, mapUser, mapUserAssociations),
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
    path: `/users/${userId}/destroy`,
    mapper: mappers.changedRecord,
  };
}

export function changePassword (userId: number, password: string) {
  return {
    path: `/users/${userId}/change_password`,
    params: { password },
    mapper: mappers.changedRecord,
  };
}

export function lock (userId: number, params: { lock: boolean, wipe_password: boolean }) {
  return {
    path: `/users/${userId}/lock`,
    params,
    mapper: mappers.changedRecord,
  };
}
