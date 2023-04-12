import { asFieldType, controls, FormFieldDefinition } from '~/components/Form';
import { common, person } from '~/lib/records';
import CaregiversField from '~/components/database/records/people/CaregiversField.vue';
import { RecordAssociations, recordsQueries } from '~/lib/api2';
import { wai } from '~/vendor/wai';
import { mapAssociation, mapDate, mapName, mapSelectOrFillTuple } from '~/lib/api2/mappers';
import { parseSharedAttributes } from '~/lib/records/application_record';

export const entity = 'people';

export function parseRecord (
  value: unknown,
  associations?: RecordAssociations,
): person.Person {
  return wai.object(value => ({
    ...parseSharedAttributes(value),
    country: wai.prop('country_id', value, mapAssociation('countries', associations)),
    student_kobo_no: wai.prop('student_kobo_no', value, wai.nullable(wai.string)),
    first_name: wai.prop('first_name', value, mapName),
    last_name: wai.prop('last_name', value, mapName),
    caregivers: wai.prop('caregivers', value, wai.nullable(wai.listOf(mapCaregiver))),
    born_on: wai.prop('born_on', value, wai.nullable(mapDate)),
    gender: wai.prop('gender', value, wai.nullable(wai.string)),
    citizen_id: wai.prop('citizen_id', value, wai.nullable(wai.string)),
    passport_no: wai.prop('passport_no', value, wai.nullable(wai.string)),
    telephone_no: wai.prop('telephone_no', value, wai.nullable(wai.string)),
    enrollment_reasons: wai.prop('enrollment_reasons', value, wai.nullable(wai.listOf(wai.string))),
    registered_on: wai.prop('registered_on', value, wai.nullable(mapDate)),
    mother_tongue: wai.prop('mother_tongue', value, wai.nullable(wai.string)),
    outside_school: wai.prop('outside_school', value, wai.nullable(wai.string)),
    nationality: wai.prop('nationality', value, wai.nullable(wai.string)),
    spoken_languages: wai.prop('spoken_languages', value, wai.nullable(wai.listOf(wai.string))),
    disabilities: wai.prop('disabilities', value, wai.nullable(mapSelectOrFillTuple)),
    disability_diagnosis: wai.prop('disability_diagnosis', value, wai.nullable(wai.boolean)),
    assistance_needed: wai.prop('assistance_needed', value, wai.nullable(wai.boolean)),
    assistance_provided: wai.prop('assistance_provided', value, wai.nullable(wai.boolean)),
    disability_note: wai.prop('disability_note', value, wai.nullable(wai.string)),
    residency_status: wai.prop('residency_status', value, wai.nullable(mapSelectOrFillTuple)),
    school_transport: wai.prop('school_transport', value, wai.nullable(mapSelectOrFillTuple)),
    school_distance_km: wai.prop('school_distance_km', value, wai.nullable(wai.integer)),
    school_distance_min: wai.prop('school_distance_min', value, wai.nullable(wai.integer)),
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

export function entityControls (): FormFieldDefinition[] {
  return [
    [ 'first_name', controls.name ],
    [ 'last_name', controls.name ],
    [ 'born_on', controls.date ],
    [ 'gender', controls.select, {
      options: common.options.formalGenders(),
    } ],
    [ 'citizen_id', controls.text ],
    [ 'passport_no', controls.text ],
    [ 'telephone_no', controls.text ],
    [ 'mother_tongue', controls.select, {
      options: [],
    } ],
    [ 'outside_school', controls.select, {
      options: person.outsideSchool(),
    } ],
    [ 'nationality', controls.select, {
      options: [],
    } ],
    [ 'spoken_languages', controls.listMultiple, {
      options: [],
    } ],
    [ 'registered_on', controls.date ],
    [ 'enrollment_reasons', controls.listMultiple, {
      options: person.enrollmentReasons(),
    } ],
    [ 'disabilities', controls.listMultiple, {
      options: person.disabilityOptions(),
    } ],
    [ 'disability_diagnosis', controls.boolean ],
    [ 'assistance_needed', controls.boolean ],
    [ 'assistance_provided', controls.boolean ],
    [ 'disability_note', controls.textMultiline ],
    [ 'residency_status', controls.selectOrFill, {
      options: person.ResidencyStatusOptions(),
    } ],
    [ 'school_distance_km', controls.integer ],
    [ 'school_distance_min', controls.integer ],
    [ 'school_transport', controls.selectOrFill, {
      options: person.schoolTransportOptions(),
    } ],
    [ 'caregivers', asFieldType(CaregiversField) ],
  ];
}
