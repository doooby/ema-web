import { Params } from '..';
import * as mappers from '../mappers';
import { group, mapScheduleOccurrences, GroupSchedule } from '~/lib/records';
import { list, object, prop, record, val } from '../mappers';

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
    mapper: (value: any): GroupSchedule.Definition => {
      const { subjects, settings, schedule } = object(value, root => ({
        subjects: prop('subjects', root, (subjects_values: any) => {
          return list(subjects_values, val.assoc);
        }),
        settings: prop('settings', root, (value: any) => value),
        schedule: prop('occurrences', root, mapScheduleOccurrences),
      }));
      const subjectsIndex = subjects.reduce((memo, subject) => {
        memo[subject.id] = subject;
        return memo;
      }, {} as any);
      const occurrences = [] as GroupSchedule.SubjectOccurrence[];
      for (const [ subject_id, date ] of schedule) {
        const subject = subjectsIndex[subject_id];
        if (subject) occurrences.push({ subject, date });
      }
      return { subjects: subjectsIndex, settings, occurrences };
    },
  };
}

export function updateSchedule (groupId: number, occurrences: [number, string][]) {
  return {
    path: `/groups/${groupId}/update_schedule`,
    params: { occurrences },
    mapper: mappers.changedRecord,
  };
}
