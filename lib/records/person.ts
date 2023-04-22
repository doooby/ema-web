import { asFieldType, controls, FormFieldDefinition } from '~/components/Form';
import { application_record, common, person } from '~/lib/records/index';
import CaregiversField from '~/components/database/records/people/CaregiversField.vue';
import { BRecord, RecordAssociations, recordsQueries } from '~/lib/api2';
import { wai } from '~/vendor/wai';
import { mapAssociation, mapDate, mapName, mapSelectOrFillTuple } from '~/lib/api2/mappers';
import { parseSharedAttributes } from '~/lib/records/application_record';
import app from '~/lib/app';

export const entity = 'people';

export interface Person extends application_record.SharedAttributes {
  country: BRecord;
  student_kobo_no?: string;
  first_name: string[];
  last_name: string[];
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
  first_name?: string[];
  last_name?: string[];
  citizen_id?: string;
  phone_no?: string;
  email?: string;
  cash_for_work?: boolean;
  humansis_cfw_id?: string;
}

export function parseRecord (
  value: unknown,
  associations?: RecordAssociations,
): Person {
  return wai.object(value => ({
    ...parseSharedAttributes(value),
    country: wai.prop('country_id', value, mapAssociation('countries', associations)),
    first_name: wai.prop('first_name', value, mapName),
    last_name: wai.prop('last_name', value, mapName),
    disability_diagnosis: wai.prop('disability_diagnosis', value, wai.nullable(wai.boolean)),
    assistance_needed: wai.prop('assistance_needed', value, wai.nullable(wai.boolean)),
    assistance_provided: wai.prop('assistance_provided', value, wai.nullable(wai.boolean)),
    school_distance_km: wai.prop('school_distance_km', value, wai.nullable(wai.integer)),
    school_distance_min: wai.prop('school_distance_min', value, wai.nullable(wai.integer)),
    student_kobo_no: wai.prop('student_kobo_no', value, wai.nullable(wai.string)),
    gender: wai.prop('gender', value, wai.nullable(wai.string)),
    citizen_id: wai.prop('citizen_id', value, wai.nullable(wai.string)),
    passport_no: wai.prop('passport_no', value, wai.nullable(wai.string)),
    telephone_no: wai.prop('telephone_no', value, wai.nullable(wai.string)),
    mother_tongue: wai.prop('mother_tongue', value, wai.nullable(wai.string)),
    outside_school: wai.prop('outside_school', value, wai.nullable(wai.string)),
    nationality: wai.prop('nationality', value, wai.nullable(wai.string)),
    disability_note: wai.prop('disability_note', value, wai.nullable(wai.string)),
    enrollment_reasons: wai.prop('enrollment_reasons', value, wai.nullable(wai.listOf(wai.string))),
    spoken_languages: wai.prop('spoken_languages', value, wai.nullable(wai.listOf(wai.string))),
    born_on: wai.prop('born_on', value, wai.nullable(mapDate)),
    registered_on: wai.prop('registered_on', value, wai.nullable(mapDate)),
    disabilities: wai.prop('disabilities', value, wai.nullable(mapSelectOrFillTuple)),
    residency_status: wai.prop('residency_status', value, wai.nullable(mapSelectOrFillTuple)),
    school_transport: wai.prop('school_transport', value, wai.nullable(mapSelectOrFillTuple)),
    caregivers: wai.prop('caregivers', value, wai.nullable(wai.listOf(mapCaregiver))),
  }))(value);
}

function mapCaregiver (value): person.PersonCaregiver {
  return wai.object(value => ({
    relation: wai.prop('relation', value, mapSelectOrFillTuple),
    first_name: wai.prop('first_name', value, wai.nullable(mapName)),
    last_name: wai.prop('last_name', value, wai.nullable(mapName)),
    citizen_id: wai.prop('citizen_id', value, wai.nullable(wai.string)),
    phone_no: wai.prop('phone_no', value, wai.nullable(wai.string)),
    email: wai.prop('email', value, wai.nullable(wai.string)),
    cash_for_work: wai.prop('cash_for_work', value, wai.nullable(wai.boolean)),
    humansis_cfw_id: wai.prop('humansis_cfw_id', value, wai.nullable(wai.string)),
  }))(value);
}

export const queries = {
  search: recordsQueries.search(entity, parseRecord),
  searchB: recordsQueries.searchB(entity),
  update: recordsQueries.update(entity),
  create: recordsQueries.create(entity),
};

export function recordControls ({
  countryData,
}: {
  countryData?: app.country.Data;
}): FormFieldDefinition[] {
  return [
    [ 'first_name', controls.name ],
    [ 'last_name', controls.name ],
    [ 'born_on', controls.date ],
    [ 'gender', controls.select, {
      options: common.options.formalGenders(),
    } ],
    [ 'citizen_id', controls.text ],
    [ 'student_kobo_no', controls.text ],
    [ 'passport_no', controls.text ],
    [ 'telephone_no', controls.text ],
    [ 'mother_tongue', controls.select, {
      options: [],
    } ],
    [ 'outside_school', controls.select, {
      options: countryData?.options.records.people.outsideSchoolTerms(),
    } ],
    [ 'nationality', controls.select, {
      options: [],
    } ],
    [ 'spoken_languages', controls.listMultiple, {
      options: [],
    } ],
    [ 'registered_on', controls.date ],
    [ 'enrollment_reasons', controls.listMultiple, {
      options: countryData?.options.records.people.enrollmentReasons(),
    } ],
    [ 'disabilities', controls.listMultiple, {
      options: countryData?.options.records.people.disabilities(),
    } ],
    [ 'disability_diagnosis', controls.boolean ],
    [ 'assistance_needed', controls.boolean ],
    [ 'assistance_provided', controls.boolean ],
    [ 'disability_note', controls.textMultiline ],
    [ 'residency_status', controls.selectOrFill, {
      options: countryData?.options.records.people.residencyStatuses(),
    } ],
    [ 'school_distance_km', controls.integer ],
    [ 'school_distance_min', controls.integer ],
    [ 'school_transport', controls.selectOrFill, {
      options: countryData?.options.records.people.schoolTransports(),
    } ],
    [ 'caregivers', asFieldType(CaregiversField), {
      relationOptions: countryData?.options.records.people.caregiverRelations(),
    } ],
  ];
}
