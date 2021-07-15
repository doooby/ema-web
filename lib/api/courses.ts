import * as mappers from './mappers';
import { ApiRequest, Params, query } from '.';
import { AssociatedRecord, AssociatedRecordsIndex, createAssociationsMapper } from './mappers';

const { object, record, recordId, prop, assoc, val } = mappers;

interface Course {
  id: number;
  name: string;
  country: AssociatedRecord;
}

interface Associations {
  country: AssociatedRecordsIndex,
}

function mapCourse (value: any, associations?: Associations): Course {
  return object(value, root => ({
    id: recordId(root),
    name: prop('name', root, val.string),
    country: assoc('country', root, associations?.country),
  }));
}

const mapAssociations = createAssociationsMapper<Associations>('country');

export function search (request: ApiRequest, params: Params) {
  return query({
    path: '/courses/search',
    data: params,
    request,
    mapper: payload => mappers.paginatedRecords(payload, mapCourse, mapAssociations),
  });
}

export function searchAssociated (request: ApiRequest, params?: Params) {
  return query({
    path: '/courses/search?assoc=1',
    data: params,
    request,
    mapper: payload => mappers.associatedRecords<Course>(payload),
  });
}

export function get (request: ApiRequest, courseId: number) {
  return query({
    path: `/courses/${courseId}`,
    request,
    mapper: payload => record(payload, mapCourse, mapAssociations),
  });
}

export function create (request: ApiRequest, course: Params) {
  return query({
    path: '/courses/create',
    data: { course },
    request,
    mapper: mappers.changedRecord,
  });
}

export function update (request: ApiRequest, courseId: number, course: Params) {
  return query({
    path: `/courses/${courseId}/update`,
    data: { course },
    request,
    mapper: mappers.changedRecord,
  });
}
