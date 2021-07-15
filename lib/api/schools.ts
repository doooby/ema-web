import * as mappers from './mappers';
import { ApiRequest, Params, query } from '.';
import { AssociatedRecord, AssociatedRecordsIndex, createAssociationsMapper } from './mappers';

const { object, record, recordId, prop, maybeProp, assoc, val } = mappers;

interface School {
  id: number;
  name: string;
  address?: string;
  country: AssociatedRecord;
}

interface Associations {
  country: AssociatedRecordsIndex,
}

function mapSchool (value: any, associations?: Associations): School {
  return object(value, root => ({
    id: recordId(root),
    name: prop('name', root, val.string),
    address: maybeProp('address', root, val.string),
    country: assoc('country', root, associations?.country),
  }));
}

const mapAssociations = createAssociationsMapper<Associations>('country');

export function search (request: ApiRequest, params: Params) {
  return query({
    path: '/schools/search',
    data: params,
    request,
    mapper: payload => mappers.paginatedRecords(payload, mapSchool, mapAssociations),
  });
}

export function searchAssociated (request: ApiRequest, params?: Params) {
  return query({
    path: '/schools/search?assoc=1',
    data: params,
    request,
    mapper: payload => mappers.associatedRecords<School>(payload),
  });
}

export function get (request: ApiRequest, schoolId: number) {
  return query({
    path: `/schools/${schoolId}`,
    request,
    mapper: payload => record(payload, mapSchool, mapAssociations),
  });
}

export function create (request: ApiRequest, school: Params) {
  return query({
    path: '/schools/create',
    data: { school },
    request,
    mapper: mappers.changedRecord,
  });
}

export function update (request: ApiRequest, schoolId: number, school: Params) {
  return query({
    path: `/schools/${schoolId}/update`,
    data: { school },
    request,
    mapper: mappers.changedRecord,
  });
}
