import { Params } from '..';
import * as mappers from '../mappers';
import { courseGuideline, CourseGuideline } from '~/lib/records';

export function index (params: Params) {
  return {
    path: '/course_guidelines',
    params,
    mapper: (payload: any) => mappers.paginatedRecords(
      payload,
      courseGuideline.mapRecord,
      courseGuideline.mapAssociations,
    ),
  };
}

export function searchAssociated (params?: Params) {
  return {
    path: '/course_guidelines?assoc=1',
    params,
    mapper: (payload: any) => mappers.associatedRecords<CourseGuideline>(payload),
  };
}

export function show (courseGuidelineId: number) {
  return {
    path: `/course_guidelines/${courseGuidelineId}`,
    mapper: (payload: any) => mappers.record(
      payload,
      courseGuideline.mapRecord,
      courseGuideline.mapAssociations,
    ),
  };
}

export function create (courseGuideline: Params) {
  return {
    path: '/course_guidelines/create',
    params: { course_guideline: courseGuideline },
    mapper: mappers.changedRecord,
  };
}

export function update (courseGuidelineId: number, courseGuideline: Params) {
  return {
    path: `/course_guidelines/${courseGuidelineId}/update`,
    params: { course_guideline: courseGuideline },
    mapper: mappers.changedRecord,
  };
}
