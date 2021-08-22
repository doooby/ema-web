import { Params } from '..';
import * as mappers from '../mappers';
import { SemesterGroup, SemesterGroupAssociations, Student } from '~/lib/records';

const { object, record, recordId, prop, assoc, val } = mappers;

function mapSemesterGroup (value: any, associations?: SemesterGroupAssociations): SemesterGroup {
  return object(value, root => ({
    id: recordId(root),
    name: prop('name', root, val.string),
    year_start: prop('year_start', root, val.integer),
    semester: prop('semester', root, val.integer),
    course: assoc('course', root, associations?.course),
  }));
}

const mapAssociations = mappers.createAssociationsMapper<SemesterGroupAssociations>('course');

export function search (params: Params) {
  return {
    path: '/semester_groups/search',
    params,
    mapper: (payload: any) => mappers.paginatedRecords(payload, mapSemesterGroup, mapAssociations),
  };
}

export function searchAssociated (params?: Params) {
  return {
    path: '/semester_groups/search?assoc=1',
    params,
    mapper: (payload: any) => mappers.associatedRecords<SemesterGroup>(payload),
  };
}

export function searchStudents (semesterGroupId: number) {
  return {
    path: `/semester_groups/${semesterGroupId}/search_students?assoc=1`,
    mapper: (payload: any) => mappers.associatedRecords<Student>(payload),
  };
}

export function get (semesterGroupId: number) {
  return {
    path: `/semester_groups/${semesterGroupId}`,
    mapper: (payload: any) => record(payload, mapSemesterGroup, mapAssociations),
  };
}

export function create (semesterGroup: Params) {
  return {
    path: '/semester_groups/create',
    params: { semester_group: semesterGroup },
    mapper: mappers.changedRecord,
  };
}

export function update (semesterGroupId: number, semesterGroup: Params) {
  return {
    path: `/semester_groups/${semesterGroupId}/update`,
    params: { semester_group: semesterGroup },
    mapper: mappers.changedRecord,
  };
}
