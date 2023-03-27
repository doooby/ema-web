import * as mappers from '~/lib/api/mappers';
import { Country } from '~/lib/records';

export interface Associations {
  country: mappers.AssociatedRecordsIndex,
}

export interface Person {
  id: number;
  country: mappers.AssociatedRecord<Country>;
  student_kobo_no?: string;
  first_name: [string, string];
  last_name: [string, string];
  caregivers?: PersonCaregiver[];
  born_on?: Date;
  gender?: string;
  citizen_id?: string;
  passport_no?: string;
  telephone_no?: string;
  enrollment_reasons?: string[];
  registered_on?: Date;
  mother_tongue?: string;
  outside_school?: string;
  nationality?: string;
  spoken_languages?: string[];
  disabilities?: [string, undefined | string];
  disability_diagnosis?: boolean;
  assistance_needed?: boolean;
  assistance_provided?: boolean;
  disability_note?: string;
  residency_status?: [string, undefined | string];
  school_transport?: [string, undefined | string];
  school_distance_km?: number;
  school_distance_min?: number;
}

export interface PersonCaregiver {
  relation: [string, undefined | string];
  first_name?: [string, string];
  last_name?: [string, string];
  citizen_id?: string;
  phone_no?: string;
  email?: string;
  cash_for_work?: boolean;
  humansis_cfw_id?: string;
}

export function parse (value: any, associations?: Associations): Person {
  return mappers.object(value, root => ({
    id: mappers.recordId(root),
    student_kobo_no: mappers.maybeProp('student_kobo_no', root, mappers.val.string),
    country: mappers.assoc('country', root, associations?.country),
    first_name: mappers.prop('first_name', root, mappers.val.nameTuple),
    last_name: mappers.prop('last_name', root, mappers.val.nameTuple),
    born_on: mappers.maybeProp('born_on', root, mappers.val.date),
    registered_on: mappers.maybeProp('registered_on', root, mappers.val.date),
    gender: mappers.maybeProp('gender', root, mappers.val.string),
    citizen_id: mappers.maybeProp('citizen_id', root, mappers.val.string),
    passport_no: mappers.maybeProp('passport_no', root, mappers.val.string),
    telephone_no: mappers.maybeProp('telephone_no', root, mappers.val.string),
    mother_tongue: mappers.maybeProp('mother_tongue', root, mappers.val.string),
    outside_school: mappers.maybeProp('outside_school', root, mappers.val.string),
    nationality: mappers.maybeProp('nationality', root, mappers.val.string),
    spoken_languages: mappers.maybeProp('spoken_languages', root, value => mappers.list(value, mappers.val.string)),
    enrollment_reasons: mappers.maybeProp('enrollment_reasons', root, value => mappers.list(value, mappers.val.string)),
    disabilities: mappers.maybeProp('disabilities', root, mappers.val.selectOrFillTuple),
    disability_diagnosis: mappers.maybeProp('disability_diagnosis', root, mappers.val.boolean),
    assistance_needed: mappers.maybeProp('assistance_needed', root, mappers.val.boolean),
    assistance_provided: mappers.maybeProp('assistance_provided', root, mappers.val.boolean),
    disability_note: mappers.maybeProp('disability_note', root, mappers.val.string),
    residency_status: mappers.maybeProp('residency_status', root, mappers.val.selectOrFillTuple),
    school_transport: mappers.maybeProp('school_transport', root, mappers.val.selectOrFillTuple),
    school_distance_km: mappers.maybeProp('school_distance_km', root, mappers.val.integer),
    school_distance_min: mappers.maybeProp('school_distance_min', root, mappers.val.integer),
    caregivers: mappers.maybeProp('caregivers', root, parseCaregivers),
  }));
}

function parseCaregivers (value: any): undefined | PersonCaregiver[] {
  if (!value) return;
  return mappers.listOfObjects(value, item => ({
    relation: mappers.prop('relation', item, mappers.val.selectOrFillTuple),
    first_name: mappers.maybeProp('first_name', item, mappers.val.nameTuple),
    last_name: mappers.maybeProp('first_name', item, mappers.val.nameTuple),
    citizen_id: mappers.maybeProp('citizen_id', item, mappers.val.string),
    phone_no: mappers.maybeProp('phone_no', item, mappers.val.string),
    email: mappers.maybeProp('email', item, mappers.val.string),
    cash_for_work: mappers.maybeProp('cash_for_work', item, mappers.val.boolean),
    humansis_cfw_id: mappers.maybeProp('humansis_cfw_id', item, mappers.val.string),
  }));
}

export const parseAssociations = mappers.createAssociationsMapper<Associations>(
  'country',
);
