import * as mappers from './mappers';
import { ApiRequest, Params, query } from '.';
import { AssociatedCourse, mapAssociatedCourse } from './associations/course';
import { AssociatedSchool, mapAssociatedSchool } from './associations/school';

const { object, record, recordId, prop, index, assoc, val } = mappers;

export interface Group {
  id: number;
  name: string;
  year: number;
  course: AssociatedCourse;
  school: AssociatedSchool;
}

interface Associations {
  course: { [id: string]: undefined | AssociatedCourse },
  school: { [id: string]: undefined | AssociatedSchool },
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

function mapAssociations (value: any): Associations {
  return object(value, root => ({
    course: prop('course', root, courses => index(courses, mapAssociatedCourse)),
    school: prop('school', root, schools => index(schools, mapAssociatedSchool)),
  }));
}

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
