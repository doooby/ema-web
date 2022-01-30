import { Params } from '..';
import * as mappers from '../mappers';
import { subject } from '~/lib/records';

export function index (params: Params) {
  return {
    path: '/subjects',
    params,
    mapper: (payload: any) => mappers.paginatedRecords(payload, subject.mapRecord, subject.mapAssociations),
  };
}

export function show (userId: number) {
  return {
    path: `/subjects/${userId}`,
    mapper: (payload: any) => mappers.record(payload, subject.mapRecord, subject.mapAssociations),
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
