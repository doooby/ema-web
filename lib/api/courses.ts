import * as mappers from './mappers';
import { ApiRequest, Params, query } from '.';
import { AssociatedCountry, mapAssociatedCountry } from './associations/country';
import { associatedRecords } from './mappers';
import { mapAssociatedCourse } from '~/lib/api/associations/course';

const { object, record, recordId, prop, index, assoc, val } = mappers;

interface Course {
  id: number;
  name: string;
  country: AssociatedCountry;
}

interface Associations {
  country: { [id: string]: undefined | AssociatedCountry },
}

function mapCourse (value: any, associations?: Associations): Course {
  return object(value, root => ({
    id: recordId(root),
    name: prop('name', root, val.string),
    country: assoc('country', root, associations?.country),
  }));
}

function mapAssociations (value: any): Associations {
  return object(value, root => ({
    country: prop('country', root, countries => index(countries, mapAssociatedCountry)),
  }));
}

export function search (request: ApiRequest, params: Params) {
  return query({
    path: '/courses/search',
    data: params,
    request,
    mapper: payload => mappers.paginatedRecords(payload, mapCourse, mapAssociations),
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

export function searchAssociated (request: ApiRequest) {
  return query({
    path: '/courses/search_associated',
    request,
    mapper: payload => associatedRecords(payload, mapAssociatedCourse),
  });
}
