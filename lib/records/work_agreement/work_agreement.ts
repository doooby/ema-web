import { RecordAssociations, recordsQueries } from '~/lib/api2';
import { application_record, work_agreement } from '~/lib/records';
import { wai } from '~/vendor/wai';
import { mapAssociation, mapAssociations, mapDate } from '~/lib/api2/mappers';
import { controls, FormFieldDefinition } from '~/components/Form';
import { dbFields } from '~/components/database/fields';

export const entity = 'work_agreements';

export function parseRecord (
  value: unknown,
  associations?: RecordAssociations,
): work_agreement.WorkAgreement {
  return wai.object(value => ({
    ...application_record.parseSharedAttributes(value),
    country: wai.prop('country_id', value, mapAssociation('countries', associations)),
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
