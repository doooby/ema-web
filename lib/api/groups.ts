import * as mappers from './mappers';
import { ApiRequest, Params, query } from '.';
import { AssociatedRecord, AssociatedRecordsIndex, createAssociationsMapper } from './mappers';

const { object, record, recordId, prop, assoc, val } = mappers;

export interface Group {
  id: number;
  name: string;
  year: number;
  course: AssociatedRecord;
  school: AssociatedRecord;
}

interface Associations {
  course: AssociatedRecordsIndex,
  school: AssociatedRecordsIndex,
}

function mapGroup (value: any, associations?: Associations): Group {
  return object(value, root => ({
    id: recordId(root),
    name: prop('name', root, val.string),
    year: prop('year', root, val.integer),
    course: assoc('course', root, associations?.course),
    school: assoc('school', root, associations?.school),
  }));
}
const mapAssociations = createAssociationsMapper<Associations>('course', 'school');

export function search (request: ApiRequest, params: Params) {
  return query({
    path: '/groups/search',
    data: params,
    request,
    mapper: payload => mappers.paginatedRecords(payload, mapGroup, mapAssociations),
  });
}

export function get (request: ApiRequest, groupId: number) {
  return query({
    path: `/groups/${groupId}`,
    request,
    mapper: payload => record(payload, mapGroup, mapAssociations),
  });
}

export function create (request: ApiRequest, group: Params) {
  return query({
    path: '/groups/create',
    data: { group },
    request,
    mapper: mappers.changedRecord,
  });
}

export function update (request: ApiRequest, groupId: number, group: Params) {
  return query({
    path: `/groups/${groupId}/update`,
    data: { group },
    request,
    mapper: mappers.changedRecord,
  });
}

export function updateStudents (request: ApiRequest, groupId: number, studentIds: number[]) {
  return query({
    path: `/groups/${groupId}/update_students`,
    data: { ids: studentIds },
    request,
    mapper: mappers.changedRecord,
  });
}
