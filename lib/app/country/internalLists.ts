import { InternalOptionsList } from '~/lib/app/types';

export const staticLists: Record<string, undefined | InternalOptionsList> = [

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
    'syrian',
  ] ],

  [ 'languages', [
    'english',
    'syrian',
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
