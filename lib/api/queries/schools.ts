import { Params } from '..';
import * as mappers from '../mappers';
import { School, SchoolAssociations, Course } from '~/lib/records';

const { object, record, recordId, prop, maybeProp, assoc, val } = mappers;

function mapSchool (value: any, associations?: SchoolAssociations): School {
  return object(value, root => ({
    id: recordId(root),
    name_en: prop('name_en', root, val.string),
    name: maybeProp('name', root, val.string),
    address: maybeProp('address', root, val.string),
    country: assoc('country', root, associations?.country),
  }));
}

const mapAssociations = mappers.createAssociationsMapper<SchoolAssociations>('country');

export function index (params: Params) {
  return {
    path: '/schools',
    params,
    mapper: (payload: any) => mappers.paginatedRecords(payload, mapSchool, mapAssociations),
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
    mapper: (payload: any) => record(payload, mapSchool, mapAssociations),
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
