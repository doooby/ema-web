import { Params } from '..';
import * as mappers from '../mappers';
import { Country } from '~/lib/records';

const { object, recordId, prop, maybeProp, val, list } = mappers;

function mapCountry (value: any): Country {
  return object(value, root => ({
    id: recordId(root),
    name: prop('name', root, val.string),
    local_names: maybeProp('local_names', root, names => list(names, val.string)) || [],
  }));
}

export function search (params: Params) {
  return {
    path: '/countries/search',
    params,
    mapper: (payload: any) => mappers.paginatedRecords(payload, mapCountry),
  };
}

export function searchAssociated (params?: Params) {
  return {
    path: '/countries/search?assoc=1',
    params,
    mapper: (payload: any) => mappers.associatedRecords<Country>(payload),
  };
}

export function get (countryId: number) {
  return {
    path: `/countries/${countryId}`,
    mapper: (payload: any) => mappers.record(payload, mapCountry),
  };
}

export function create (country: Params) {
  return {
    path: '/countries/create',
    params: { country },
    mapper: mappers.changedRecord,
  };
}
