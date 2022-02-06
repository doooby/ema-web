import { Params } from '..';
import * as mappers from '../mappers';
import { School, school } from '~/lib/records';

export function index (params: Params) {
  return {
    path: '/schools',
    params,
    mapper: (payload: any) => mappers.paginatedRecords(payload, school.mapRecord, school.mapAssociations),
  };
}

export function searchAssociated (params?: Params) {
  return {
    path: '/schools?assoc=1',
    params,
    mapper: (payload: any) => mappers.associatedRecords<School>(payload),
  };
}

export function show (schoolId: number) {
  return {
    path: `/schools/${schoolId}`,
    mapper: (payload: any) => mappers.record(payload, school.mapRecord, school.mapAssociations),
  };
}

export function create (school: Params) {
  return {
    path: '/schools/create',
    params: { school },
    mapper: mappers.changedRecord,
  };
}

export function update (schoolId: number, school: Params) {
  return {
    path: `/schools/${schoolId}/update`,
    params: { school },
    mapper: mappers.changedRecord,
  };
}
