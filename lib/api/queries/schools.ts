import { Params } from '..';
import * as mappers from '../mappers';
import { School, SchoolAssociations, Course } from '~/lib/records';

const { object, record, recordId, prop, maybeProp, assoc, val } = mappers;

function mapSchool (value: any, associations?: SchoolAssociations): School {
  return object(value, root => ({
    id: recordId(root),
    name: prop('name', root, val.string),
    address: maybeProp('address', root, val.string),
    country: assoc('country', root, associations?.country),
  }));
}

const mapAssociations = mappers.createAssociationsMapper<SchoolAssociations>('country');

export function search (params: Params) {
  return {
    path: '/schools/search',
    params,
    mapper: (payload: any) => mappers.paginatedRecords(payload, mapSchool, mapAssociations),
  };
}

export function searchAssociated (params?: Params) {
  return {
    path: '/schools/search?assoc=1',
    params,
    mapper: (payload: any) => mappers.associatedRecords<School>(payload),
  };
}

export function searchCourses (schoolId: number) {
  return {
    path: `/schools/${schoolId}/search_courses?assoc=1`,
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
