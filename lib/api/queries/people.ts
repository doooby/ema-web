import { Params } from '..';
import * as mappers from '../mappers';
import { person } from '~/lib/records';

const { record } = mappers;

export function index (params: Params) {
  return {
    path: '/students',
    params,
    mapper: (payload: any) => mappers.paginatedRecords(payload, person.mapRecord, person.mapAssociations),
  };
}

export function show (studentId: number) {
  return {
    path: `/students/${studentId}`,
    mapper: (payload: any) => record(payload, person.mapRecord, person.mapAssociations),
  };
}

export function create (student: Params) {
  return {
    path: '/students/create',
    params: { student },
    mapper: mappers.changedRecord,
  };
}

export function update (studentId: number, student: Params) {
  return {
    path: `/students/${studentId}/update`,
    params: { student },
    mapper: mappers.changedRecord,
  };
}
