import { Params } from '..';
import * as mappers from '../mappers';
import { Student, StudentAssociations } from '~/lib/records';

const { object, record, recordId, prop, maybeProp, assoc, val } = mappers;

// function mapMaybeItemOfList (value: any, list: any[]): any {
//   return list.includes(value) ? value : undefined;
// }

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
    residency: maybeProp('residency', root, val.string),
    language: maybeProp('language', root, val.string),
    nationality: maybeProp('nationality', root, val.string),
    region: maybeProp('region', root, val.string),
    address: maybeProp('address', root, val.string),
    distance_school_km: maybeProp('distance_school_km', root, val.string),
    distance_school_time: maybeProp('distance_school_time', root, val.integer),
    transportation: maybeProp('transportation', root, val.string),
    mother_first_name_en: maybeProp('mother_first_name_en', root, val.string),
    mother_last_name_en: maybeProp('mother_last_name_en', root, val.string),
    mother_first_name: maybeProp('mother_first_name', root, val.string),
    mother_last_name: maybeProp('mother_last_name', root, val.string),
    father_first_name_en: maybeProp('father_first_name_en', root, val.string),
    father_last_name_en: maybeProp('father_last_name_en', root, val.string),
    father_first_name: maybeProp('father_first_name', root, val.string),
    father_last_name: maybeProp('father_last_name', root, val.string),
    caregiver_first_name_en: maybeProp('caregiver_first_name_en', root, val.string),
    caregiver_last_name_en: maybeProp('caregiver_last_name_en', root, val.string),
    caregiver_first_name: maybeProp('caregiver_first_name', root, val.string),
    caregiver_last_name: maybeProp('caregiver_last_name', root, val.string),
    caregiver_id: maybeProp('caregiver_id', root, val.string),
    caregiver_contact: maybeProp('caregiver_contact', root, val.string),
    caregiver_gender: maybeProp('caregiver_gender', root, val.string),
    caregiver_relation: maybeProp('caregiver_relation', root, val.string),
    caregiver_cfw: maybeProp('caregiver_cfw', root, val.string),
    caregiver_humansis: maybeProp('caregiver_humansis', root, val.string),
    disability: maybeProp('disability', root, val.string),
    disability_diagnosis: maybeProp('disability_diagnosis', root, val.string),
    assistance_needed: maybeProp('assistance_needed', root, val.string),
    oos_before: maybeProp('oos_before', root, val.integer),
    enrolment_on: maybeProp('enrolment_on', root, val.date),
    notes: maybeProp('notes', root, val.string),
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
