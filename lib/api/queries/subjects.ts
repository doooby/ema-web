import { Params } from '..';
import * as mappers from '../mappers';
import { Subject } from '~/lib/records';

const { object, recordId, prop, maybeProp, val } = mappers;

function mapSubject (value: any): Subject {
  return object(value, root => ({
    id: recordId(root),
    name_en: prop('name_en', root, val.string),
    name: maybeProp('name', root, val.string),
  }));
}

export function index (params: Params) {
  return {
    path: '/subjects',
    params,
    mapper: (payload: any) => mappers.paginatedRecords(payload, mapSubject),
  };
}

export function show (userId: number) {
  return {
    path: `/subjects/${userId}`,
    mapper: (payload: any) => mappers.record(payload, mapSubject),
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
