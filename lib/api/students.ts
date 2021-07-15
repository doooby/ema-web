import * as mappers from './mappers';
import { ApiRequest, Params, query } from '.';
import { AssociatedRecord, AssociatedRecordsIndex, createAssociationsMapper } from './mappers';

const { object, record, recordId, prop, assoc, val } = mappers;

export interface Student {
  id: number;
  full_name: string;
  country: AssociatedRecord;
}

interface Associations {
  country: AssociatedRecordsIndex,
}

function mapStudent (value: any, associations?: Associations): Student {
  return object(value, root => ({
    id: recordId(root),
    full_name: prop('full_name', root, val.string),
    country: assoc('country', root, associations?.country),
  }));
}

const mapAssociations = createAssociationsMapper<Associations>('country');

export function search (request: ApiRequest, params: Params) {
  return query({
    path: '/students/search',
    data: params,
    request,
    mapper: payload => mappers.paginatedRecords(payload, mapStudent, mapAssociations),
  });
}

export function searchAssociated (request: ApiRequest, params?: Params) {
  return query({
    path: '/students/search?assoc=1',
    data: params,
    request,
    mapper: payload => mappers.associatedRecords<Student>(payload),
  });
}

export function get (request: ApiRequest, studentId: number) {
  return query({
    path: `/students/${studentId}`,
    request,
    mapper: payload => record(payload, mapStudent, mapAssociations),
  });
}

export function create (request: ApiRequest, student: Params) {
  return query({
    path: '/students/create',
    data: { student },
    request,
    mapper: mappers.changedRecord,
  });
}

export function update (request: ApiRequest, studentId: number, student: Params) {
  return query({
    path: `/students/${studentId}/update`,
    data: { student },
    request,
    mapper: mappers.changedRecord,
  });
}
