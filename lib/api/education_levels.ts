import * as mappers from './mappers';
import { Params } from '.';
import { AssociatedRecord, AssociatedRecordsIndex, createAssociationsMapper } from './mappers';

const { object, record, recordId, prop, assoc, val } = mappers;

export interface EducationLevel {
  id: number;
  name: string;
  grade: number;
  semesters: number;
  years_length: number;
  start_age: number;
  mandatory: boolean;
  country: AssociatedRecord;
}

interface Associations {
  country: AssociatedRecordsIndex,
}

function mapEducationLevel (value: any, associations?: Associations): EducationLevel {
  return object(value, root => ({
    id: recordId(root),
    name: prop('name', root, val.string),
    grade: prop('grade', root, val.integer),
    semesters: prop('semesters', root, val.integer),
    years_length: prop('years_length', root, val.integer),
    start_age: prop('start_age', root, val.integer),
    mandatory: prop('mandatory', root, val.boolean),
    country: assoc('country', root, associations?.country),
  }));
}

const mapAssociations = createAssociationsMapper<Associations>('country');

export function search (params: Params) {
  return {
    path: '/education_levels/search',
    params,
    mapper: (payload: any) => mappers.paginatedRecords(payload, mapEducationLevel, mapAssociations),
  };
}

export function searchAssociated (params?: Params) {
  return {
    path: '/education_levels/search?assoc=1',
    params,
    mapper: (payload: any) => mappers.associatedRecords<EducationLevel>(payload),
  };
}

export function get (educationLevelId: number) {
  return {
    path: `/education_levels/${educationLevelId}`,
    mapper: (payload: any) => record(payload, mapEducationLevel, mapAssociations),
  };
}

export function create (educationLevel: Params) {
  return {
    path: '/education_levels/create',
    params: { education_level: educationLevel },
    mapper: mappers.changedRecord,
  };
}

export function update (educationLevelId: number, educationLevel: Params) {
  return {
    path: `/education_levels/${educationLevelId}/update`,
    params: { education_level: educationLevel },
    mapper: mappers.changedRecord,
  };
}
