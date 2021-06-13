import * as mappers from './mappers';
import { ApiRequest, Params, query } from '.';

const { object, recordId, prop, val } = mappers;

interface Country {
  id: string;
  name: string;
}

function mapCountry (value: any): Country {
  return object(value, root => ({
    id: recordId(root),
    name: prop('name', root, val.string),
  }));
}

export function search (request: ApiRequest, params: Params) {
  return query({
    path: '/countries/search',
    data: params,
    request,
    mapper: payload => mappers.paginatedRecords(payload, mapCountry),
  });
}

export function get (request: ApiRequest, countryId: string) {
  return query({
    path: `/countries/${countryId}`,
    request,
    mapper: payload => mappers.record(payload, mapCountry),
  });
}

export function create (request: ApiRequest, country: Params) {
  return query({
    path: '/countries/create',
    data: { country },
    request,
    mapper: mappers.changedRecord,
  });
}
