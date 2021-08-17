import * as mappers from './mappers';
import { Params } from '.';
import { AssociatedRecord, AssociatedRecordsIndex, createAssociationsMapper } from './mappers';
import { Subject } from '~/lib/records';

const { object, record, recordId, prop, assoc, val } = mappers;

export interface Course {
  id: number;
  name: string;
  education_level: AssociatedRecord;
}

interface Associations {
  education_level: AssociatedRecordsIndex,
}

function mapCourse (value: any, associations?: Associations): Course {
  return object(value, root => ({
    id: recordId(root),
    name: prop('name', root, val.string),
    education_level: assoc('education_level', root, associations?.education_level),
  }));
}

const mapAssociations = createAssociationsMapper<Associations>('education_level');

export function search (params: Params) {
  return {
    path: '/courses/search',
    params,
    mapper: (payload: any) => mappers.paginatedRecords(payload, mapCourse, mapAssociations),
  };
}

export function searchAssociated (params?: Params) {
  return {
    path: '/courses/search?assoc=1',
    params,
    mapper: (payload: any) => mappers.associatedRecords<Course>(payload),
  };
}

export function searchSubjects (courseId: number) {
  return {
    path: `/courses/${courseId}/search_subjects?assoc=1`,
    mapper: (payload: any) => mappers.associatedRecords<Subject>(payload),
  };
}

export function get (courseId: number) {
  return {
    path: `/courses/${courseId}`,
    mapper: (payload: any) => record(payload, mapCourse, mapAssociations),
  };
}

export function create (course: Params) {
  return {
    path: '/courses/create',
    params: { course },
    mapper: mappers.changedRecord,
  };
}

export function update (courseId: number, course: Params) {
  return {
    path: `/courses/${courseId}/update`,
    params: { course },
    mapper: mappers.changedRecord,
  };
}
