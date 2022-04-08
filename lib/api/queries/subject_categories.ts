import { Params } from '..';
import * as mappers from '../mappers';
import { subjectCategory } from '~/lib/records';

export function index (params: Params) {
  return {
    path: '/subject_categories',
    params,
    mapper: (payload: any) => mappers.paginatedRecords(
      payload,
      subjectCategory.mapRecord,
      subjectCategory.mapAssociations,
    ),
  };
}

export function show (userId: number) {
  return {
    path: `/subject_categories/${userId}`,
    mapper: (payload: any) => mappers.record(
      payload,
      subjectCategory.mapRecord,
      subjectCategory.mapAssociations,
    ),
  };
}

export function create (subjectCategory: Params) {
  return {
    path: '/subject_categories/create',
    params: { subject_category: subjectCategory },
    mapper: mappers.changedRecord,
  };
}

export function update (subjectCategoryId: number, subjectCategory: Params) {
  return {
    path: `/subject_categories/${subjectCategoryId}/update`,
    params: { subject_category: subjectCategory },
    mapper: mappers.changedRecord,
  };
}
