import { Params } from '..';
import * as mappers from '../mappers';
import { Subject } from '~/lib/records';

const { object, record, recordId, prop, val } = mappers;

function mapSubject (value: any): Subject {
  return object(value, root => ({
    id: recordId(root),
    name: prop('name', root, val.string),
  }));
}

export function index (params: Params) {
  return {
    path: '/subjects',
    params,
    mapper: (payload: any) => mappers.paginatedRecords(payload, mapSubject),
  };
}

export function searchAssociated (params?: Params) {
  return {
    path: '/subjects?assoc=1',
    params,
    mapper: (payload: any) => mappers.associatedRecords<Subject>(payload),
  };
}

export function get (subjectId: number) {
  return {
    path: `/subjects/${subjectId}`,
    mapper: (payload: any) => record(payload, mapSubject),
  };
}

export function create (subject: Params) {
  return {
    path: '/subjects/create',
    params: { subject },
    mapper: mappers.changedRecord,
  };
}

export function update (subjectId: number, subject: Params) {
  return {
    path: `/subjects/${subjectId}/update`,
    params: { subject },
    mapper: mappers.changedRecord,
  };
}
