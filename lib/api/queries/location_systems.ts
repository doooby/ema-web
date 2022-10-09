import * as mappers from '~/lib/api/mappers';
import { location_system } from '~/lib/records';
import { Params } from '~/lib/api';

export function getAddressSystem (params: Params) {
  return {
    path: '/location_systems',
    params: {
      ...params,
      label: 'address',
      per_page: 1,
    },
    mapper: (payload: any) => mappers.paginatedRecords(payload, location_system.mapRecord),
  };
}
