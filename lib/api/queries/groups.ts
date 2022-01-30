import { Params } from '..';
import * as mappers from '../mappers';
import { Group, mapGroupAssociations, mapTermGroup, Person } from '~/lib/records';
import { record } from '../mappers';

export function search (params: Params) {
  return {
    path: '/term_groups/search',
    params,
    mapper: (payload: any) => mappers.paginatedRecords(payload, mapTermGroup, mapGroupAssociations),
  };
}

export function searchAssociated (params?: Params) {
  return {
    path: '/term_groups/search?assoc=1',
    params,
    mapper: (payload: any) => mappers.associatedRecords<Group>(payload),
  };
}

export function searchStudents (termGroupId: number) {
  return {
    path: `/term_groups/${termGroupId}/search_students?assoc=1`,
    mapper: (payload: any) => mappers.associatedRecords<Person>(payload),
  };
}

export function get (termGroupId: number) {
  return {
    path: `/term_groups/${termGroupId}`,
    mapper: (payload: any) => record(payload, mapTermGroup, mapGroupAssociations),
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
