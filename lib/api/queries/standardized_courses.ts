import { Params } from '..';
import * as mappers from '../mappers';
import { StandardizedCourse, standardizedCourse } from '~/lib/records';

export function index (params: Params) {
  return {
    path: '/standardized_courses',
    params,
    mapper: (payload: any) => mappers.paginatedRecords(
      payload,
      standardizedCourse.mapRecord,
      standardizedCourse.mapAssociations,
    ),
  };
}

export function searchAssociated (params?: Params) {
  return {
    path: '/standardized_courses?assoc=1',
    params,
    mapper: (payload: any) => mappers.associatedRecords<StandardizedCourse>(payload),
  };
}

export function show (courseId: number) {
  return {
    path: `/standardized_courses/${courseId}`,
    mapper: (payload: any) => mappers.record(
      payload,
      standardizedCourse.mapRecord,
      standardizedCourse.mapAssociations,
    ),
  };
}

export function create (course: Params) {
  return {
    path: '/standardized_courses/create',
    params: { standardized_course: course },
    mapper: mappers.changedRecord,
  };
}

export function update (courseId: number, course: Params) {
  return {
    path: `/standardized_courses/${courseId}/update`,
    params: { standardized_course: course },
    mapper: mappers.changedRecord,
  };
}
