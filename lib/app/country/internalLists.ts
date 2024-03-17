import { InternalOptionsList } from '~/lib/app/types';

export const staticLists: Record<string, undefined | InternalOptionsList> = [

  [ 'options_all_none', [
    'all',
    'none',
  ] ],

  [ 'accreditation_authority', [
    'gov',
    'ngo',
  ] ],

  [ 'education_type', [
    'formal',
    'informal',
  ] ],

  [ 'gender', [
    'f',
    'm',
  ] ],

  [ 'disabilities', [
    'hearing',
    'visual',
    'physical',
    'intellectual',
    'mental',
    'communication',
    'autism',
  ] ],

  [ 'enrolment_reasons', [
    'education',
    'closest_school',
    'sole_school',
    'best_school',
    'is_behind',
    'needs_pss',
    'community_integration',
    'safest_place',
    'needs_social',
  ] ],

  [ 'outside_school_terms', [
    '<1m',
    '1-2m',
    '3-6m',
    '7-11m',
    '1y',
    '2y',
    '>=3y',
  ] ],

  [ 'residency_status', [
    'resident_host',
    'idp',
    'returnee',
    'refugee',
  ] ],

  [ 'distance_to_school', [
    '<1km',
    '1-2km',
    '2km',
    '3-5km',
    '5-10km',
    '<10km',
    '<15km',
    '<20km',
  ] ],

  [ 'school_transport', [
    'walk',
    'bike',
    'car',
    'motorbike',
    'public',
    'bus',
  ] ],

  [ 'caregivers.relation', [
    'mother',
    'father',
    'stepmother',
    'stepfather',
    'grandmother',
    'grandfather',
    'aunt',
    'uncle',
    'sister',
    'brother',
  ] ],

  [ 'contract_positions', [
    'th_as',
    'cl',
    'gu',
    'th',
    'pss',
    'sup',
    't',
    'tr',
  ] ],

  [ 'resignation_reasons', [
    'moved',
  ] ],

  [ 'teaching_qualifications', [
    'ped_2',
    'bc',
    'mas',
    'crs_gov',
    'crs',
  ] ],

  [ 'nationalities', [
    'ethiopian',
    'syrian',
  ] ],

  [ 'languages', [
    'eng', // English
    'ara', // Arabic
    'amh', // Amharic
    'drs', // Gedeo / Gedeofa
    'orm', // Oromo / Oromifa
    'sid', // Sidama / Sidamigna
    'wal', // Wolaitta / Wolayitigna
  ] ],

  [ 'attendance', [
    '-',
    'X',
    'C', // Cultural / Religious
    'E', // Economical / Financial
    'S', // Security
    'P', // Political
    'M', // Child Marriage
    'F', // Family Reason
    'A', // Agriculture
    'W', // Weather
    'H', // Health / Medical
    'L', // Labour
    'O', // Other
  ] ],

  [ 'dropout_reasons', [
    'child_labour',
    'relocation',
    'no_phone',
    'phone_issues',
    'sickness',
    'changed_school',
    'early_marriage',
  ] ],

].reduce(
  (memo, item: any) => {
    const [ name, options ] = item;
    if (memo[name]) throw new Error(`list ${name} already defined`);
    memo[name] = { name, options };
    return memo;
  },
  {},
);
