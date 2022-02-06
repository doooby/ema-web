import { Params } from '..';
import * as mappers from '../mappers';
import { course, Course } from '~/lib/records';

export function index (params: Params) {
  return {
    path: '/courses',
    params,
    mapper: (payload: any) => mappers.paginatedRecords(payload, course.mapRecord, course.mapAssociations),
  };
}

export function searchAssociated (params?: Params) {
  return {
    path: '/courses?assoc=1',
    params,
    mapper: (payload: any) => mappers.associatedRecords<Course>(payload),
  };
}

export function show (courseId: number) {
  return {
    path: `/courses/${courseId}`,
    mapper: (payload: any) => mappers.record(payload, course.mapRecord, course.mapAssociations),
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
