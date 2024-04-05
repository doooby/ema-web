import { asFieldType, controls, FormFieldDefinition } from '~/components/Form';
import { application_record, person } from '~/lib/records/index';
import CaregiversField from '~/components/database/records/people/CaregiversField.vue';
import { BRecord, RecordAssociations, recordsQueries } from '~/lib/api2';
import { wai } from '~/vendor/wai';
import { mapAssociation, mapDate, mapName, mapSelectOrFillTuple } from '~/lib/api2/mappers';
import { parseSharedAttributes } from '~/lib/records/application_record';
import app from '~/lib/app';

export const entity = 'people';

export function parseRecordSlice (value) {
  return wai.object2(value, value => ({
    names: wai.property(value, 'names', wai.nullable(wai.listOf(wai.nullable(wai.listOfStrings)))),
    born_on: wai.property(value, 'born_on', wai.time),
    registered_on: wai.property(value, 'registered_on', wai.nullable(wai.time)),
    enrolled_on: wai.property(value, 'enrolled_on', wai.nullable(wai.time)),
    external_id: wai.property(value, 'external_id', wai.nullable(wai.string)),
    gender: wai.property(value, 'gender', wai.nullable(wai.string)),
    nationality: wai.property(value, 'nationality', wai.nullable(wai.string)),
    citizen_id: wai.property(value, 'citizen_id', wai.nullable(wai.string)),
    passport_no: wai.property(value, 'passport_no', wai.nullable(wai.string)),
    telephone_no: wai.property(value, 'telephone_no', wai.nullable(wai.string)),
    mother_tongue: wai.property(value, 'mother_tongue', wai.nullable(wai.string)),
    outside_school: wai.property(value, 'outside_school', wai.nullable(wai.string)),
    disability_note: wai.property(value, 'disability_note', wai.nullable(wai.string)),
    navision_id: wai.property(value, 'navision_id', wai.nullable(wai.string)),
    teaching_qualification: wai.property(value, 'teaching_qualification', wai.nullable(wai.string)),
    school_distance_km: wai.property(value, 'school_distance_km', wai.nullable(wai.string)),
    school_distance_min: wai.property(value, 'school_distance_min', wai.nullable(wai.integer)),
    disability_diagnosis: wai.property(value, 'disability_diagnosis', wai.nullable(wai.boolean)),
    assistance_needed: wai.property(value, 'assistance_needed', wai.nullable(wai.boolean)),
    assistance_provided: wai.property(value, 'assistance_provided', wai.nullable(wai.boolean)),
    spoken_languages: wai.property(value, 'spoken_languages', wai.nullable(wai.listOfStrings)),
    disabilities: wai.property(value, 'disabilities', wai.nullable(wai.listOfStrings)),
    enrollment_reasons: wai.property(value, 'enrollment_reasons', wai.nullable(wai.listOfStrings)),
    school_transport: wai.property(value, 'school_transport', wai.nullable(wai.listOfStrings)),
    residency_status: wai.property(value, 'residency_status', wai.nullable(wai.listOfStrings)),
    birthplace_address: wai.property(value, 'birthplace_address', wai.nullable(wai.listOfStrings)),
    address: wai.property(value, 'address', wai.nullable(wai.listOfStrings)),
    caregivers: wai.property(value, 'caregivers', wai.nullable(wai.listOf(parsePersonCaregiver))),
  }));
}
export function parsePersonCaregiver (value) {
  return wai.object2(value, value => ({
    type: wai.property(value, 'type', wai.string),
    names: wai.property(value, 'names', wai.nullable(wai.listOf(wai.nullable(wai.listOfStrings)))),
    relation_other: wai.property(value, 'relation_other', wai.nullable(wai.string)),
    citizen_id: wai.property(value, 'citizen_id', wai.nullable(wai.string)),
    phone_no: wai.property(value, 'phone_no', wai.nullable(wai.string)),
    email: wai.property(value, 'email', wai.nullable(wai.string)),
    humansis_cfw_id: wai.property(value, 'humansis_cfw_id', wai.nullable(wai.string)),
    cash_for_work: wai.property(value, 'cash_for_work', wai.nullable(wai.boolean)),
  }));
}

export interface Person extends application_record.SharedAttributes {
  country: BRecord;
  main_group?: {
    group: BRecord;
    course: BRecord;
    school: BRecord;
    dropout?: Date;
  };
  main_contract?: {
    work_agreement: BRecord;
    position?: string;
    school: BRecord;
  };
  student_kobo_no?: string;
  external_id?: string;
  navision_id?: string;
  caption: string;
  full_name_local: string;
  first_name: string[];
  last_name?: string[];
  mother_first_name?: string[];
  mother_last_name?: string[];
  father_first_name?: string[];
  father_last_name?: string[];
  caregivers?: PersonCaregiver[];
  born_on?: Date;
  gender?: string;
  citizen_id?: string;
  passport_no?: string;
  telephone_no?: string;
  enrollment_reasons?: string[];
  enrolled_on?: Date;
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
  school_distance_km?: string;
  school_distance_min?: number;
  teaching_qualification?: string;
}

export interface PersonCaregiver {
  type: string;
  relation_other?: string;
  names?: app.PersonNames;
  relation?: [string, undefined | string];
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
    main_group: wai.prop('main_group', value, wai.nullable(wai.object(value => ({
      group: wai.prop('group_id', value, mapAssociation('groups', associations)),
      course: wai.prop('course_id', value, mapAssociation('courses', associations)),
      school: wai.prop('school_id', value, mapAssociation('schools', associations)),
      dropout: wai.prop('dropout', value, wai.nullable(wai.time)),
    })))),
    main_contract: wai.prop('main_contract', value, wai.nullable(wai.object(value => ({
      work_agreement: wai.prop('work_agreement_id', value, mapAssociation('work_agreements', associations)),
      position: wai.prop('position', value, wai.nullable(wai.string)),
      school: wai.prop('school_id', value, mapAssociation('schools', associations)),
    })))),
    caption: wai.prop('caption', value, wai.string),
    full_name_local: wai.prop('full_name_local', value, wai.string),
    first_name: wai.prop('first_name', value, wai.nullable(mapName)) ?? [],
    last_name: wai.prop('last_name', value, wai.nullable(mapName)),
    mother_first_name: wai.prop('mother_first_name', value, wai.nullable(mapName)),
    mother_last_name: wai.prop('mother_last_name', value, wai.nullable(mapName)),
    father_first_name: wai.prop('father_first_name', value, wai.nullable(mapName)),
    father_last_name: wai.prop('father_last_name', value, wai.nullable(mapName)),
    disability_diagnosis: wai.prop('disability_diagnosis', value, wai.nullable(wai.boolean)),
    assistance_needed: wai.prop('assistance_needed', value, wai.nullable(wai.boolean)),
    assistance_provided: wai.prop('assistance_provided', value, wai.nullable(wai.boolean)),
    school_distance_km: wai.prop('school_distance_km', value, wai.nullable(wai.string)),
    school_distance_min: wai.prop('school_distance_min', value, wai.nullable(wai.integer)),
    student_kobo_no: wai.prop('student_kobo_no', value, wai.nullable(wai.string)),
    external_id: wai.prop('external_id', value, wai.nullable(wai.string)),
    navision_id: wai.prop('navision_id', value, wai.nullable(wai.string)),
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
    enrolled_on: wai.prop('enrolled_on', value, wai.nullable(mapDate)),
    disabilities: wai.prop('disabilities', value, wai.nullable(mapSelectOrFillTuple)),
    residency_status: wai.prop('residency_status', value, wai.nullable(mapSelectOrFillTuple)),
    school_transport: wai.prop('school_transport', value, wai.nullable(mapSelectOrFillTuple)),
    teaching_qualification: wai.prop('teaching_qualification', value, wai.nullable(wai.string)),
    caregivers: wai.prop('caregivers', value, wai.nullable(wai.listOf(mapCaregiver))),
  }))(value);
}

function mapCaregiver (value): person.PersonCaregiver {
  return wai.object(value => ({
    type: '',
    relation: wai.prop('relation', value, wai.nullable(mapSelectOrFillTuple)),
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
  countryData?: app.session.CountryData;
}): FormFieldDefinition[] {
  return [
    [ 'first_name', controls.name ],
    [ 'last_name', controls.name ],
    [ 'mother_first_name', controls.name ],
    [ 'mother_last_name', controls.name ],
    [ 'father_first_name', controls.name ],
    [ 'father_last_name', controls.name ],
    [ 'born_on', controls.calendar ],
    [ 'gender', controls.select, {
      options: app.internalOptionsList(countryData, 'gender'),
    } ],
    [ 'citizen_id', controls.text ],
    [ 'student_kobo_no', controls.text ],
    [ 'external_id', controls.text ],
    [ 'navision_id', controls.text ],
    [ 'passport_no', controls.text ],
    [ 'telephone_no', controls.text ],
    [ 'mother_tongue', controls.select, {
      options: app.internalOptionsList(countryData, 'languages'),
    } ],
    [ 'outside_school', controls.select, {
      options: app.extendOptionsList(
        app.internalOptionsList(countryData, 'outside_school_terms'),
        { empty: true },
      ),
    } ],
    [ 'nationality', controls.select, {
      options: app.internalOptionsList(countryData, 'nationalities'),
    } ],
    [ 'spoken_languages', controls.selectMultiple, {
      options: app.internalOptionsList(countryData, 'languages'),
    } ],
    [ 'registered_on', controls.calendar ],
    [ 'enrolled_on', controls.calendar ],
    [ 'enrollment_reasons', controls.selectMultiple, {
      options: app.internalOptionsList(countryData, 'enrolment_reasons'),
    } ],
    [ 'disabilities', controls.selectMultiple, {
      options: app.extendOptionsList(
        app.internalOptionsList(countryData, 'disabilities'),
        { other: true },
      ),
    } ],
    [ 'disability_diagnosis', controls.boolean ],
    [ 'assistance_needed', controls.boolean ],
    [ 'assistance_provided', controls.boolean ],
    [ 'disability_note', controls.textMultiline ],
    [ 'residency_status', controls.selectOrFill, {
      options: app.extendOptionsList(
        app.internalOptionsList(countryData, 'residency_status'),
        { empty: true },
      ),
    } ],
    [ 'school_distance_km', controls.select, {
      options: app.extendOptionsList(
        app.internalOptionsList(countryData, 'distance_to_school'),
        { empty: true },
      ),
    } ],
    [ 'school_distance_min', controls.integer ],
    [ 'school_transport', controls.selectOrFill, {
      options: app.extendOptionsList(
        app.internalOptionsList(countryData, 'school_transport'),
        { empty: true },
      ),
    } ],
    [ 'teaching_qualification', controls.select, {
      options: app.extendOptionsList(
        app.internalOptionsList(countryData, 'teaching_qualifications'),
        { empty: true },
      ),
    } ],
  ];
}

export function mainGroupAssociations () {
  return [
    {
      entity: 'schools',
      attr: 'main_group.school',
    },
    {
      entity: 'courses',
      attr: 'main_group.course',
    },
    {
      entity: 'groups',
      attr: 'main_group.group',
    },
  ];
}

export function mainContractAssociations () {
  return [
    {
      entity: 'work_agreements',
      attr: 'main_contract.work_agreement',
    },
    {
      entity: 'donors',
      attr: 'main_contract.donor',
    },
    {
      entity: 'schools',
      attr: 'main_contract.school',
    },
  ];
}
