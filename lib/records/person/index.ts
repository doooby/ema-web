import { person } from '~/lib/records';

export * from './type';
export * from './person';

export function disabilityOptions () {
  const list = [
    'hearing',
    'visual',
    'physical',
    'intellectual',
    'mental',
    'communication',
    'autism',
    'other',
  ];
  return Object.freeze(list.map(value => ({
    value, text: `db.record.people.disabilities.${value}`,
  })));
}

export function enrollmentReasons () {
  const list = [
    'education',
    'closest_school',
    'sole_school',
    'best_school',
    'is_behind',
    'needs_pss',
    'center_help',
    'community_integration',
    'social_net',
    'safest_place',
    'needs_social',
  ];
  return Object.freeze(list.map(value => ({
    value, text: `db.record.people.enrolment_reasons.${value}`,
  })));
}

export function outsideSchool () {
  const list = [
    'less than one month',
    '1-2 months',
    '1-2 years',
    'More than 2 years',
    '7-12 months',
    '3-6 months',
  ];
  return Object.freeze(list.map(value => ({
    value, text: value,
  })));
}

export function ResidencyStatusOptions () {
  return Object.freeze([
    { value: '', text: 'lexicon.unknown' },
    { value: 'resident_host', text: 'db.record.people.residency_status.resident_host' },
    { value: 'idp', text: 'db.record.people.residency_status.idp' },
    { value: 'returnee', text: 'db.record.people.residency_status.returnee' },
    { value: 'refugee', text: 'db.record.people.residency_status.refugee' },
  ]);
}

export function schoolTransportOptions () {
  return Object.freeze([
    { value: '', text: 'lexicon.unknown' },
    { value: 'walk', text: 'db.record.people.school_transport.walk' },
    { value: 'bike', text: 'db.record.people.school_transport.bike' },
    { value: 'car', text: 'db.record.people.school_transport.car' },
    { value: 'motorbike', text: 'db.record.people.school_transport.motorbike' },
    { value: 'public', text: 'db.record.people.school_transport.public' },
    { value: 'bus', text: 'db.record.people.school_transport.bus' },
  ]);
}

export function caregiverRelationOptions () {
  return Object.freeze([
    { value: 'sister', text: 'db.record.people.caregivers.relation.sister' },
    { value: 'stepfather', text: 'db.record.people.caregivers.relation.father' },
    { value: 'father', text: 'db.record.people.caregivers.relation.father' },
    { value: 'brother', text: 'db.record.people.caregivers.relation.brother' },
    { value: 'stepmother', text: 'db.record.people.caregivers.relation.mother' },
    { value: 'grandfather', text: 'db.record.people.caregivers.relation.father' },
    { value: 'uncle', text: 'db.record.people.caregivers.relation.uncle' },
    { value: 'mother', text: 'db.record.people.caregivers.relation.mother' },
    { value: 'aunt', text: 'db.record.people.caregivers.relation.aunt' },
    { value: 'grandmother', text: 'db.record.people.caregivers.relation.mother' },
  ]);
}

caregiverRelationOptions.defaultValue = 'mother';

export function getFatherNameLocal (person: person.Person): string {
  return person.caregivers?.find(caregiver => caregiver.relation[0] === 'father')?.first_name?.[1] ?? '';
}
