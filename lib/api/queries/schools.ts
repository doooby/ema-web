import { Params } from '..';
import * as mappers from '../mappers';
import { School, Course, school } from '~/lib/records';

const { object, record, prop, val } = mappers;

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

export function searchCourses (schoolId: number) {
  return {
    path: `/schools/${schoolId}/courses?assoc=1`,
    mapper: (payload: any) => mappers.associatedRecords<Course>(payload),
  };
}

export function get (schoolId: number) {
  return {
    path: `/schools/${schoolId}`,
    mapper: (payload: any) => record(payload, school.mapRecord, school.mapAssociations),
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

export function deleteRecord (schoolId: number) {
  return {
    method: 'DELETE',
    path: `/users/${schoolId}`,
    mapper: (payload: any) => object(payload, root => ({
      success: prop('success', root, val.boolean),
    })),
  };
}
