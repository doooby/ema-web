import { Params } from '~/lib/api';
import * as mappers from '~/lib/api/mappers';
import { location } from '~/lib/records';

export function index (params: Params) {
  return {
    path: '/locations',
    params,
    mapper: (payload: any) => mappers.paginatedRecords(payload, location.mapRecord),
  };
}
