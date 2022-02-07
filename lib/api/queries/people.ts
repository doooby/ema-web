import { Params } from '..';
import * as mappers from '../mappers';
import { person } from '~/lib/records';

const { record } = mappers;

export function index (params: Params) {
  return {
    path: '/people',
    params,
    mapper: (payload: any) => mappers.paginatedRecords(payload, person.mapRecord, person.mapAssociations),
  };
}

export function show (personId: number) {
  return {
    path: `/people/${personId}`,
    mapper: (payload: any) => record(payload, person.mapRecord, person.mapAssociations),
  };
}

export function create (person: Params) {
  return {
    path: '/people/create',
    params: { person },
    mapper: mappers.changedRecord,
  };
}

export function update (personId: number, person: Params) {
  return {
    path: `/people/${personId}/update`,
    params: { person },
    mapper: mappers.changedRecord,
  };
}
