import { wai } from '~/vendor/wai';

export function parseHeader (value) {
  return wai.object2(value, value => ({
    born_on: wai.property(value, 'born_on', wai.time),
    external_id: wai.property(value, 'external_id', wai.nullable(wai.string)),
    gender: wai.property(value, 'gender', wai.nullable(wai.string)),
    name_local: wai.property(value, 'name_local', wai.string),
    residency_status: wai.property(value, 'residency_status', wai.nullable(wai.listOfStrings)),
  }));
}

export function parseAssignmentChanges (value) {
  return wai.object2(value, value => ({
    added_first: wai.property(value, 'added_first', wai.nullable(wai.time)),
    added_last: wai.property(value, 'added_last', wai.nullable(wai.time)),
    removed: wai.property(value, 'removed', wai.nullable(wai.time)),
  }));
}

export function parseAttendance (value) {
  return wai.object2(value, value => ({
    present: wai.property(value, 'present', wai.integer),
    must: wai.property(value, 'must', wai.integer),
    sessions: wai.property(value, 'sessions', wai.integer),
  }));
}
