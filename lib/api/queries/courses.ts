import { Params } from '..';
import * as mappers from '../mappers';
import { Course, CourseAssociations, Subject } from '~/lib/records';

const { object, record, recordId, prop, assoc, val } = mappers;

function mapCourse (value: any, associations?: CourseAssociations): Course {
  return object(value, root => ({
    id: recordId(root),
    name: prop('name', root, val.string),
    grade: prop('grade', root, val.integer),
    education_level: assoc('education_level', root, associations?.education_level),
  }));
}

const mapAssociations = mappers.createAssociationsMapper<CourseAssociations>('education_level');

export function search (params: Params) {
  return {
    path: '/courses/search',
    params,
    mapper: (payload: any) => mappers.paginatedRecords(payload, mapCourse, mapAssociations),
  };
}

export function searchAssociated (params?: Params) {
  return {
    path: '/courses/search?assoc=1',
    params,
    mapper: (payload: any) => mappers.associatedRecords<Course>(payload),
  };
}

export function searchSubjects (courseId: number) {
  return {
    path: `/courses/${courseId}/search_subjects?assoc=1`,
    mapper: (payload: any) => mappers.associatedRecords<Subject>(payload),
  };
}

export function get (courseId: number) {
  return {
    path: `/courses/${courseId}`,
    mapper: (payload: any) => record(payload, mapCourse, mapAssociations),
  };
}

export function create (course: Params) {
  return {
    path: '/courses/create',
    params: { course },
    mapper: mappers.changedRecord,
  };
}

export function update (courseId: number, course: Params) {
  return {
    path: `/courses/${courseId}/update`,
    params: { course },
    mapper: mappers.changedRecord,
  };
}
