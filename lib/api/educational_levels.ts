import * as mappers from './mappers';
import { ApiRequest, Params, query } from '.';
import { AssociatedCountry, mapAssociatedCountry } from './associations/country';

const { object, record, recordId, prop, index, assoc, val } = mappers;

interface EducationalLevel {
  id: number;
  order: number;
  name: string;
  start_age: number;
  years_length: number;
  country: AssociatedCountry;
}

interface Associations {
  country: { [id: string]: undefined | AssociatedCountry },
}

function mapEducationalLevel (value: any, associations?: Associations): EducationalLevel {
  return object(value, root => ({
    id: recordId(root),
    order: prop('order', root, val.integer),
    name: prop('name', root, val.string),
    start_age: prop('start_age', root, val.integer),
    years_length: prop('years_length', root, val.integer),
    country: assoc('country', root, associations?.country),
  }));
}

function mapAssociations (value: any): Associations {
  return object(value, root => ({
    country: prop('country', root, countries => index(countries, mapAssociatedCountry)),
  }));
}

export function search (request: ApiRequest, params: Params) {
  return query({
    path: '/educational_levels/search',
    data: params,
    request,
    mapper: payload => mappers.paginatedRecords(payload, mapEducationalLevel, mapAssociations),
  });
}

export function get (request: ApiRequest, educationalLevelId: number) {
  return query({
    path: `/educational_levels/${educationalLevelId}`,
    request,
    mapper: payload => record(payload, mapEducationalLevel, mapAssociations),
  });
}

export function create (request: ApiRequest, educationalLevel: Params) {
  return query({
    path: '/educational_levels/create',
    data: { educationalLevel },
    request,
    mapper: mappers.changedRecord,
  });
}

export function update (request: ApiRequest, educationalLevelId: number, educationalLevel: Params) {
  return query({
    path: `/educational_levels/${educationalLevelId}/update`,
    data: { educationalLevel },
    request,
    mapper: mappers.changedRecord,
  });
}

// export function searchAssociated (request: ApiRequest) {
//   return query({
//     path: '/educational_levels/search_associated',
//     request,
//     mapper: payload => associatedRecords(payload, mapAssociatedEducationalLevel),
//   });
// }
