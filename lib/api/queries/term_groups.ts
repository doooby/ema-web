import { Params } from '..';
import * as mappers from '../mappers';
import { TermGroup, TermGroupAssociations, Student } from '~/lib/records';

const { object, record, recordId, prop, maybeProp, assoc, val } = mappers;

function mapTermGroup (value: any, associations?: TermGroupAssociations): TermGroup {
  return object(value, root => ({
    id: recordId(root),
    name: prop('name', root, val.string),
    year_start: prop('year_start', root, val.integer),
    term: maybeProp('term', root, val.integer),
    school: assoc('school', root, associations?.school),
    course: assoc('course', root, associations?.course),
  }));
}

const mapAssociations = mappers.createAssociationsMapper<TermGroupAssociations>('school', 'course');

export function search (params: Params) {
  return {
    path: '/term_groups/search',
    params,
    mapper: (payload: any) => mappers.paginatedRecords(payload, mapTermGroup, mapAssociations),
  };
}

export function searchAssociated (params?: Params) {
  return {
    path: '/term_groups/search?assoc=1',
    params,
    mapper: (payload: any) => mappers.associatedRecords<TermGroup>(payload),
  };
}

export function searchStudents (termGroupId: number) {
  return {
    path: `/term_groups/${termGroupId}/search_students?assoc=1`,
    mapper: (payload: any) => mappers.associatedRecords<Student>(payload),
  };
}

export function get (termGroupId: number) {
  return {
    path: `/term_groups/${termGroupId}`,
    mapper: (payload: any) => record(payload, mapTermGroup, mapAssociations),
  };
}

export function create (termGroup: Params) {
  return {
    path: '/term_groups/create',
    params: { term_group: termGroup },
    mapper: mappers.changedRecord,
  };
}

export function update (termGroupId: number, termGroup: Params) {
  return {
    path: `/term_groups/${termGroupId}/update`,
    params: { term_group: termGroup },
    mapper: mappers.changedRecord,
  };
}
