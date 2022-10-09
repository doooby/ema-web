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
  ];
  return Object.freeze(list.map(value => ({
    value, text: `db.record.people.disabilities.${value}`,
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
    { value: 'mother', text: 'db.record.people.caregivers.relation.mother' },
    { value: 'father', text: 'db.record.people.caregivers.relation.father' },
    { value: 'brother', text: 'db.record.people.caregivers.relation.brother' },
    { value: 'sister', text: 'db.record.people.caregivers.relation.sister' },
    { value: 'uncle', text: 'db.record.people.caregivers.relation.uncle' },
    { value: 'aunt', text: 'db.record.people.caregivers.relation.aunt' },
  ]);
}

caregiverRelationOptions.defaultValue = 'mother';
