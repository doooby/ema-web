import * as mappers from './mappers';
import { Params } from '.';
import { AssociatedRecord, AssociatedRecordsIndex, createAssociationsMapper } from './mappers';

const { object, record, recordId, prop, assoc, val } = mappers;

interface Subject {
  id: number;
  name: string;
  education_level: AssociatedRecord;
}

interface Associations {
  education_level: AssociatedRecordsIndex,
}

function mapSubject (value: any, associations?: Associations): Subject {
  return object(value, root => ({
    id: recordId(root),
    name: prop('name', root, val.string),
    education_level: assoc('education_level', root, associations?.education_level),
  }));
}

const mapAssociations = createAssociationsMapper<Associations>('education_level');

export function search (params: Params) {
  return {
    path: '/subjects/search',
    params,
    mapper: (payload: any) => mappers.paginatedRecords(payload, mapSubject, mapAssociations),
  };
}

export function searchAssociated (params?: Params) {
  return {
    path: '/subjects/search?assoc=1',
    params,
    mapper: (payload: any) => mappers.associatedRecords<Subject>(payload),
  };
}

export function get (subjectId: number) {
  return {
    path: `/subjects/${subjectId}`,
    mapper: (payload: any) => record(payload, mapSubject, mapAssociations),
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
