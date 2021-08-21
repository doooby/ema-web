import { Params } from '..';
import * as mappers from '../mappers';
import { Subject, SubjectAssociations } from '~/lib/records';

const { object, record, recordId, prop, assoc, val } = mappers;

function mapSubject (value: any, associations?: SubjectAssociations): Subject {
  return object(value, root => ({
    id: recordId(root),
    name: prop('name', root, val.string),
    education_level: assoc('education_level', root, associations?.education_level),
  }));
}

const mapAssociations = mappers.createAssociationsMapper<SubjectAssociations>('education_level');

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
