import * as mappers from '~/lib/api/mappers';
import { asFieldType, FormFieldDefinition } from '~/components/Form';
import { Country } from '~/lib/records/country';
import AssociatedRecordField from '~/components/database/records/AssociatedRecordField.vue';

const { object, recordId, prop, maybeProp, assoc, val } = mappers;

export interface Person {
  id: number;
  country: mappers.AssociatedRecord<Country>;
  family_name_en: string;
  family_name: string;
  given_name_en: string;
  given_name: string;
  born_on?: Date;
}

export interface PersonAssociations {
  country: mappers.AssociatedRecordsIndex,
}

// function mapOptions (list: string[]) {
//   return list.map((value, index) => ({ value: String(index), caption: value }));
// }

export const person = {
  mapRecord (value: any, associations?: PersonAssociations): Person {
    return object(value, root => ({
      id: recordId(root),
      country: assoc('country', root, associations?.country),
      family_name_en: prop('family_name_en', root, val.string),
      family_name: prop('family_name', root, val.string),
      given_name_en: prop('given_name_en', root, val.string),
      given_name: prop('given_name', root, val.string),
      born_on: maybeProp('born_on', root, val.date),
    }));
  },
  mapAssociations: mappers.createAssociationsMapper<PersonAssociations>(
    'country',
  ),

  // genderOptions: Object.freeze([
  //   { value: 'f', caption: 'Female' },
  //   { value: 'm', caption: 'Male' },
  //   { value: 'o', caption: 'Other' },
  // ]),
  //
  // residencyOptions: Object.freeze(mapOptions([
  //   'IDP',
  //   'Host/Resident',
  //   'Resettled',
  //   'Returnee',
  //   'Unknown',
  // ])),
  //
  // distanceToSchool: Object.freeze(mapOptions([
  //   '< 1 Km',
  //   '1-2 Km',
  //   '3-5 Km',
  //   '5-10 Km',
  //   '> 10 Km',
  //   '> 15 Km',
  //   '> 20 Km',
  // ])),
  //
  // typeOfTransportationOptions: Object.freeze(mapOptions([
  //   'Walk',
  //   'Bike',
  //   'Motorbike / car',
  //   'School bus',
  //   'Public transport',
  //   'Other',
  //   'Unknown',
  // ])),
  //
  // caregiverRelationOption: Object.freeze([
  //   'father',
  //   'mother',
  //   'brother',
  //   'sister',
  //   'uncle',
  //   'aunt',
  //   'other',
  // ].map(value => ({ value, caption: value }))),
  //
  // disabilityOptions: Object.freeze([
  //   'physical',
  //   'mental',
  //   'intellectual',
  //   'deafness',
  //   'blindness',
  //   'visual impairment',
  //   'hearing impairment',
  //   'deafblindness',
  //   'other',
  // ].map(value => ({ value, caption: value }))),
  //
  // disabilityDiagnosis: Object.freeze([
  //   'Yes',
  //   'No',
  //   'Unknown',
  // ].map(value => ({ value, caption: value }))),
  //
  // assistanceNeededOptions: Object.freeze([
  //   'Any Assistance Needed',
  //   'Special assistance needed',
  //   'Catch up classes needed',
  //   'Catch up classes litercy',
  //   'Catch up classes numeracy',
  //   'Catch up classes subject specific',
  //   'Remedial classes litercy',
  //   'Remedial classes numeracy',
  //   'Remedial classes subject specific',
  //   'Health Assistance needed',
  //   'MHPSS Assistance needed',
  //   'Protection Assistance needed',
  //   'Food Security  Assistance needed',
  //   'Nutrition  Assistance needed',
  // ].map((value, index) => ({ value: String(index), caption: value }))),
  //
  // assistanceNeededSelected (value: any): any[] {
  //   const selected = [];
  //   const values = String(value).split(',');
  //   for (const value of values) {
  //     const option = value && student.assistanceNeededOptions.find((option: any) => option.value === value);
  //     if (option) selected.push(option);
  //   }
  //   return selected;
  // },

  // caregivers_cfwToText ({ caregivers_cfw }: Student): string {
  //   if (!caregivers_cfw) return '';
  //   if (caregivers_cfw.v === 1) return `CFW=1, humansis_id=${caregivers_cfw.h}`;
  //   return 'CFW=0';
  // },

  // disabilityToText ({ disability }: Student): string {
  //   if (!disability) return '';
  //   const { s, d, n, p } = disability;
  //   const dd = d === 1 ? d : (d === 0 ? 0 : 'n/a');
  //   const nn = n === 1 ? n : 0;
  //   const pp = p === 1 ? p : 0;
  //   return `status=${s}, diagnosis=${dd}, assistance needed=${nn}, provided=${pp}`;
  // },

  recordControls (): FormFieldDefinition[] {
    return [
      [ 'country', asFieldType(AssociatedRecordField), { entity: 'countries' } ],
      [ 'family_name_en', 'text' ],
      [ 'family_name', 'text' ],
      [ 'given_name_en', 'text' ],
      [ 'given_name', 'text' ],
      [ 'born_on', 'date' ],
      // [ 'last_name', dbFields.Name ],
      // [ 'born_on', 'date' ],
      // [ 'gender', 'list', { options: student.genderOptions } ],
      // [ 'nationality', 'text' ],
      // [ 'language', 'text' ],
      // [ 'residency', 'list', { options: student.residencyOptions } ],
      // [ 'region', 'text' ],
      // [ 'address', 'text' ],
      // [ 'distance_school_km', 'list', { options: student.distanceToSchool } ],
      // [ 'distance_school_time', 'text', { rightLabel: () => $t('misc.time.min') } ],
      // [ 'transportation', 'list', { options: student.typeOfTransportationOptions } ],
      // [ 'mother_first_name', dbFields.Name ],
      // [ 'mother_last_name', dbFields.Name ],
      // [ 'father_first_name', dbFields.Name ],
      // [ 'father_last_name', dbFields.Name ],
      // [ 'caregiver_first_name', dbFields.Name ],
      // [ 'caregiver_last_name', dbFields.Name ],
      // [ 'caregiver_relation', 'list', { options: student.caregiverRelationOption } ],
      // [ 'caregiver_id', 'text' ],
      // [ 'caregiver_gender', 'list', { options: student.genderOptions } ],
      // [ 'caregiver_contact', 'text' ],
      // [ 'caregiver_cfw', 'list', { options: [ 'yes', 'no' ].map(value => ({ value, caption: value })) } ],
      // [ 'caregiver_humansis', 'text' ],
      // [ 'disability', 'list', { options: student.disabilityOptions } ],
      // [ 'disability_diagnosis', 'list', { options: student.disabilityDiagnosis } ],
      // [ 'assistance_needed', 'selectMultiple', { options: student.assistanceNeededOptions } ],
      // [ 'oos_before', 'integer', { rightLabel: () => 'months' } ],
      // [ 'enrolment_on', 'date', { deletable: true } ],
      // [ 'notes', 'textMultiline' ],
    ];
  },
};
