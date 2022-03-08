import { Params } from '..';
import * as mappers from '../mappers';
import { group, mapScheduleOccurrences } from '~/lib/records';
import { object, prop, record } from '../mappers';

export function index (params: Params) {
  return {
    path: '/groups',
    params,
    mapper: (payload: any) => mappers.paginatedRecords(payload, group.mapRecord, group.mapAssociations),
  };
}

export function show (groupId: number) {
  return {
    path: `/groups/${groupId}`,
    mapper: (payload: any) => record(payload, group.mapRecord, group.mapAssociations),
  };
}

export function create (group: Params) {
  return {
    path: '/groups/create',
    params: { group },
    mapper: mappers.changedRecord,
  };
}

export function update (groupId: number, group: Params) {
  return {
    path: `/groups/${groupId}/update`,
    params: { group },
    mapper: mappers.changedRecord,
  };
}

export function showSchedule (groupId: number) {
  return {
    path: `/groups/${groupId}/show_schedule`,
    mapper: (value: any) => object(value, root =>
      prop('occurrences', root, mapScheduleOccurrences),
    ),
  };
}

export function updateSchedule (groupId: number, occurrences: [number, string][]) {
  return {
    path: `/groups/${groupId}/update_schedule`,
    params: { occurrences },
    mapper: mappers.changedRecord,
  };
}
