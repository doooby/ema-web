import { Params } from '..';
import * as mappers from '../mappers';
import { mapEducationLevel, mapEducationLevelAssociations } from '~/lib/records';

export function index (params: Params) {
  return {
    path: '/education_levels',
    params,
    mapper: (payload: any) => mappers.paginatedRecords(payload, mapEducationLevel, mapEducationLevelAssociations),
  };
}
