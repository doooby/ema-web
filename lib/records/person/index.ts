export * from './type';
export * from './person';

export function disabilityOptions () {
  return Object.freeze([
    { value: '', text: '', translated: true },
    { value: 'physical', text: 'db.record.people.disability.physical' },
    { value: 'mental', text: 'db.record.people.disability.mental' },
    { value: 'intellectual', text: 'db.record.people.disability.intellectual' },
    { value: 'deafness', text: 'db.record.people.disability.deafness' },
    { value: 'blindness', text: 'db.record.people.disability.blindness' },
    { value: 'visual_impairment', text: 'db.record.people.disability.visual_impairment' },
    { value: 'hearing_impairment', text: 'db.record.people.disability.hearing_impairment' },
    { value: 'deafblindness', text: 'db.record.people.disability.deafblindness' },
  ]);
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
