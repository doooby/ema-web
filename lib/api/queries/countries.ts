import { Params } from '..';
import * as mappers from '../mappers';
import { Country, mapCountry } from '~/lib/records';

export function index (params: Params) {
  return {
    path: '/countries',
    params,
    mapper: (payload: any) => mappers.paginatedRecords(payload, mapCountry),
  };
}

export function searchAssociated (params?: Params) {
  return {
    path: '/countries?assoc=1',
    params,
    mapper: (payload: any) => mappers.associatedRecords<Country>(payload),
  };
}
