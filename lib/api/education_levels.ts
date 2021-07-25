import * as mappers from './mappers';
import { ApiRequest, Params, query } from '.';
import { AssociatedRecord, AssociatedRecordsIndex, createAssociationsMapper } from './mappers';

const { object, record, recordId, prop, assoc, val } = mappers;

interface EducationLevel {
  id: number;
  order: number;
  name: string;
  start_age: number;
  years_length: number;
  country: AssociatedRecord;
}

interface Associations {
  country: AssociatedRecordsIndex,
}

function mapEducationLevel (value: any, associations?: Associations): EducationLevel {
  return object(value, root => ({
    id: recordId(root),
    order: prop('order', root, val.integer),
    name: prop('name', root, val.string),
    start_age: prop('start_age', root, val.integer),
    years_length: prop('years_length', root, val.integer),
    country: assoc('country', root, associations?.country),
  }));
}

const mapAssociations = createAssociationsMapper<Associations>('country');

export function search (request: ApiRequest, params: Params) {
  return query({
    path: '/education_levels/search',
    data: params,
    request,
    mapper: payload => mappers.paginatedRecords(payload, mapEducationLevel, mapAssociations),
  });
}

export function get (request: ApiRequest, educationLevelId: number) {
  return query({
    path: `/education_levels/${educationLevelId}`,
    request,
    mapper: payload => record(payload, mapEducationLevel, mapAssociations),
  });
}

export function create (request: ApiRequest, EducationLevel: Params) {
  return query({
    path: '/education_levels/create',
    data: { EducationLevel },
    request,
    mapper: mappers.changedRecord,
  });
}

export function update (request: ApiRequest, educationLevelId: number, EducationLevel: Params) {
  return query({
    path: `/education_levels/${educationLevelId}/update`,
    data: { EducationLevel },
    request,
    mapper: mappers.changedRecord,
  });
}
