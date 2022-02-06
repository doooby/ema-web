import { Params } from '..';
import * as mappers from '../mappers';
import { EducationLevel, mapEducationLevel, mapEducationLevelAssociations } from '~/lib/records';

export function index (params: Params) {
  return {
    path: '/education_levels',
    params,
    mapper: (payload: any) => mappers.paginatedRecords(payload, mapEducationLevel, mapEducationLevelAssociations),
  };
}

export function searchAssociated (params?: Params) {
  return {
    path: '/education_levels?assoc=1',
    params,
    mapper: (payload: any) => mappers.associatedRecords<EducationLevel>(payload),
  };
}
