import { Params } from '..';
import * as mappers from '../mappers';
import { Student, StudentAssociations } from '~/lib/records';

const { object, record, recordId, prop, maybeProp, assoc, val, list } = mappers;

function mapMaybeItemOfList (value: any, list: any[]): any {
  return list.includes(value) ? value : undefined;
}

function mapStudent (value: any, associations?: StudentAssociations): Student {
  return object(value, root => ({
    id: recordId(root),
    country: assoc('country', root, associations?.country),
    first_name_en: prop('first_name_en', root, val.string),
    last_name_en: prop('last_name_en', root, val.string),
    first_name: maybeProp('first_name', root, val.string),
    last_name: maybeProp('last_name', root, val.string),
    born_on: maybeProp('born_on', root, val.date),
    gender: maybeProp('gender', root, val.string),
    language: maybeProp('language', root, val.string),
    address: maybeProp('address', root, val.string),
    residency: maybeProp('residency', root, val.string),
    distance_school_km: maybeProp('distance_school_km', root, val.integer),
    distance_school_time: maybeProp('distance_school_time', root, val.integer),
    caregivers_en: maybeProp('caregivers_en', root, caregivers => list(caregivers, val.string)),
    caregivers: maybeProp('caregivers', root, caregivers => list(caregivers, val.string)),
    caregivers_contact: maybeProp('caregivers_contact', root, val.string),
    caregivers_cfw: maybeProp('caregivers_cfw', root, (value) => {
      if (typeof value !== 'object') return undefined;
      const { v, h } = value;
      if (v === 0) return { v };
      if (v === 1) return { v, h: String(h) };
      return undefined;
    }),
    out_of_school: maybeProp('out_of_school', root, val.integer),
    enrolment_on: maybeProp('enrolment_on', root, val.date),
    completion_on: maybeProp('completion_on', root, val.date),
    dropped_out_on: maybeProp('dropped_out_on', root, val.date),
    drop_out_reason: maybeProp('drop_out_reason', root, val.string),
    disability: maybeProp('disability', root, (value) => {
      if (typeof value !== 'object') return undefined;
      const { s, d, n, p } = value;
      return {
        s: String(s),
        d: mapMaybeItemOfList(d, [ 0, 1 ]),
        n: mapMaybeItemOfList(n, [ 1 ]),
        p: mapMaybeItemOfList(p, [ 1 ]),
      };
    }),
  }));
}

const mapAssociations = mappers.createAssociationsMapper<StudentAssociations>('country');

export function search (params: Params) {
  return {
    path: '/students/search',
    params,
    mapper: (payload: any) => mappers.paginatedRecords(payload, mapStudent, mapAssociations),
  };
}

export function searchAssociated (params?: Params) {
  return {
    path: '/students/search?assoc=1',
    params,
    mapper: (payload: any) => mappers.associatedRecords<Student>(payload),
  };
}

export function get (studentId: number) {
  return {
    path: `/students/${studentId}`,
    mapper: (payload: any) => record(payload, mapStudent, mapAssociations),
  };
}

export function create (student: Params) {
  return {
    path: '/students/create',
    params: { student },
    mapper: mappers.changedRecord,
  };
}

export function update (studentId: number, student: Params) {
  return {
    path: `/students/${studentId}/update`,
    params: { student },
    mapper: mappers.changedRecord,
  };
}
