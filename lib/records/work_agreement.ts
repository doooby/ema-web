import { BRecord, RecordAssociations, recordsQueries } from '~/lib/api2';
import { application_record } from '~/lib/records/index';
import { wai } from '~/vendor/wai';
import { mapAssociation, mapAssociations, mapDate } from '~/lib/api2/mappers';
import { controls, FormFieldDefinition } from '~/components/Form';
import { dbFields } from '~/components/database/fields';

export const entity = 'work_agreements';

export interface WorkAgreement extends application_record.SharedAttributes {
  school: BRecord;
  person: BRecord;
  projects?: BRecord[];
  donors?: BRecord[];
  position?: string;
  starts_on?: Date;
  ends_on?: Date;
  resigned_on?: Date;
  comment?: string;
}

export function parseRecord (
  value: unknown,
  associations?: RecordAssociations,
): WorkAgreement {
  return wai.object(value => ({
    ...application_record.parseSharedAttributes(value),
    school: wai.prop('school_id', value, mapAssociation('schools', associations)),
    person: wai.prop('person_id', value, mapAssociation('people', associations)),
    projects: wai.prop('projects_ids', value, mapAssociations('projects', associations)),
    donors: wai.prop('donors_ids', value, mapAssociations('donors', associations)),
    position: wai.prop('position', value, wai.nullable(wai.string)),
    starts_on: wai.prop('starts_on', value, wai.nullable(mapDate)),
    ends_on: wai.prop('ends_on', value, wai.nullable(mapDate)),
    resigned_on: wai.prop('resigned_on', value, wai.nullable(mapDate)),
    comment: wai.prop('comment', value, wai.nullable(wai.string)),
  }))(value);
}

export const queries = {
  search: recordsQueries.search(entity, parseRecord),
  searchB: recordsQueries.searchB(entity),
  create: recordsQueries.create(entity),
  update: recordsQueries.update(entity),
};

export function recordControls (): FormFieldDefinition[] {
  return [
    [ 'school', dbFields.selectBRecord, { entity: 'schools' } ],
    [ 'person', dbFields.selectBRecord, { entity: 'people' } ],
    [ 'projects', dbFields.selectManyBRecords, { entity: 'projects' } ],
    [ 'donors', dbFields.selectManyBRecords, { entity: 'donors' } ],
    [ 'position', controls.text ],
    [ 'starts_on', controls.calendar ],
    [ 'ends_on', controls.calendar ],
    [ 'resigned_on', controls.calendar ],
    [ 'comment', controls.textMultiline ],
  ];
}
