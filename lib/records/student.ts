import * as mappers from '~/lib/api/mappers';

export interface Student {
  id: number;
  country: mappers.AssociatedRecord;
  first_name_en: string;
  last_name_en: string;
  first_name?: string;
  last_name?: string;
  born_on?: Date;
  gender?: string;
  residency?: string;
  language?: string;
  nationality?: string;
  region?: string;
  address?: string;
  distance_school_km?: string;
  distance_school_time?: number;
  transportation?: string;
  mother_first_name_en?: string;
  mother_last_name_en?: string;
  mother_first_name?: string;
  mother_last_name?: string;
  father_first_name_en?: string;
  father_last_name_en?: string;
  father_first_name?: string;
  father_last_name?: string;
  caregiver_first_name_en?: string;
  caregiver_last_name_en?: string;
  caregiver_first_name?: string;
  caregiver_last_name?: string;
  caregiver_id?: string;
  caregiver_gender?: string;
  caregiver_relation?: string;
  caregiver_contact?: string;
  caregiver_cfw?: string;
  caregiver_humansis?: string;
  disability?: string;
  disability_diagnosis?: string;
  assistance_needed?: string;
  oos_before?: number;
  enrolment_on?: Date;
  notes?: string;
}

export interface StudentAssociations {
  country: mappers.AssociatedRecordsIndex,
}

function mapOptions (list: string[]) {
  return list.map((value, index) => ({ value: String(index), caption: value }));
}

export const student = {
  genderOptions: Object.freeze([
    { value: 'f', caption: 'Female' },
    { value: 'm', caption: 'Male' },
    { value: 'o', caption: 'Other' },
  ]),

  residencyOptions: Object.freeze(mapOptions([
    'IDP',
    'Host/Resident',
    'Resettled',
    'Returnee',
    'Unknown',
  ])),

  distanceToSchool: Object.freeze(mapOptions([
    '< 1 Km',
    '1-2 Km',
    '3-5 Km',
    '5-10 Km',
    '> 10 Km',
    '> 15 Km',
    '> 20 Km',
  ])),

  typeOfTransportationOptions: Object.freeze(mapOptions([
    'Walk',
    'Bike',
    'Motorbike / car',
    'School bus',
    'Public transport',
    'Other',
    'Unknown',
  ])),

  caregiverRelationOption: Object.freeze([
    'father',
    'mother',
    'brother',
    'sister',
    'uncle',
    'aunt',
    'other',
  ].map(value => ({ value, caption: value }))),

  disabilityOptions: Object.freeze([
    'physical',
    'mental',
    'intellectual',
    'deafness',
    'blindness',
    'visual impairment',
    'hearing impairment',
    'deafblindness',
    'other',
  ].map(value => ({ value, caption: value }))),

  disabilityDiagnosis: Object.freeze([
    'Yes',
    'No',
    'Unknown',
  ].map(value => ({ value, caption: value }))),

  assistanceNeededOptions: Object.freeze([
    'Any Assistance Needed',
    'Special assistance needed',
    'Catch up classes needed',
    'Catch up classes litercy',
    'Catch up classes numeracy',
    'Catch up classes subject specific',
    'Remedial classes litercy',
    'Remedial classes numeracy',
    'Remedial classes subject specific',
    'Health Assistance needed',
    'MHPSS Assistance needed',
    'Protection Assistance needed',
    'Food Security  Assistance needed',
    'Nutrition  Assistance needed',
  ].map((value, index) => ({ value: String(index), caption: value }))),

  assistanceNeededSelected (value: any): any[] {
    const selected = [];
    const values = String(value).split(',');
    for (const value of values) {
      const option = value && student.assistanceNeededOptions.find((option: any) => option.value === value);
      if (option) selected.push(option);
    }
    return selected;
  },

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

  entityControls (context: any): any[] {
    return [
      [ 'country', 'associatedRecord', { entity: 'countries' } ],
      [ 'first_name_en', 'text', { leftLabel: () => context.$t('misc.language.en') } ],
      [ 'last_name_en', 'text', { leftLabel: () => context.$t('misc.language.en') } ],
      [ 'first_name', 'text' ],
      [ 'last_name', 'text' ],
      [ 'born_on', 'date' ],
      [ 'gender', 'list', { options: student.genderOptions } ],
      [ 'nationality', 'text' ],
      [ 'language', 'text' ],
      [ 'residency', 'list', { options: student.residencyOptions } ],
      [ 'region', 'text' ],
      [ 'address', 'text' ],
      [ 'distance_school_km', 'list', { options: student.distanceToSchool } ],
      [ 'distance_school_time', 'text', { rightLabel: () => context.$t('misc.time.min') } ],
      [ 'transportation', 'list', { options: student.typeOfTransportationOptions } ],
      [ 'mother_first_name_en', 'text', { leftLabel: () => context.$t('misc.language.en') } ],
      [ 'mother_last_name_en', 'text', { leftLabel: () => context.$t('misc.language.en') } ],
      [ 'mother_first_name', 'text' ],
      [ 'mother_last_name', 'text' ],
      [ 'father_first_name_en', 'text', { leftLabel: () => context.$t('misc.language.en') } ],
      [ 'father_last_name_en', 'text', { leftLabel: () => context.$t('misc.language.en') } ],
      [ 'father_first_name', 'text' ],
      [ 'father_last_name', 'text' ],
      [ 'caregiver_first_name_en', 'text', { leftLabel: () => context.$t('misc.language.en') } ],
      [ 'caregiver_last_name_en', 'text', { leftLabel: () => context.$t('misc.language.en') } ],
      [ 'caregiver_first_name', 'text' ],
      [ 'caregiver_last_name', 'text' ],
      [ 'caregiver_relation', 'list', { options: student.caregiverRelationOption } ],
      [ 'caregiver_id', 'text' ],
      [ 'caregiver_gender', 'list', { options: student.genderOptions } ],
      [ 'caregiver_contact', 'text' ],
      [ 'caregiver_cfw', 'list', { options: [ 'yes', 'no' ].map(value => ({ value, caption: value })) } ],
      [ 'caregiver_humansis', 'text' ],
      [ 'disability', 'list', { options: student.disabilityOptions } ],
      [ 'disability_diagnosis', 'list', { options: student.disabilityDiagnosis } ],
      [ 'assistance_needed', 'selectMultiple', { options: student.assistanceNeededOptions } ],
      [ 'oos_before', 'integer', { rightLabel: () => 'months' } ],
      [ 'enrolment_on', 'date', { deletable: true } ],
      [ 'notes', 'textMultiline' ],
    ];
  },
};
