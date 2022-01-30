import { Params } from '..';
import * as mappers from '../mappers';
import { Course, mapCourse, mapCourseAssociations, Subject } from '~/lib/records';

export function search (params: Params) {
  return {
    path: '/courses/search',
    params,
    mapper: (payload: any) => mappers.paginatedRecords(payload, mapCourse, mapCourseAssociations),
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
    mapper: (payload: any) => mappers.record(payload, mapCourse, mapCourseAssociations),
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
