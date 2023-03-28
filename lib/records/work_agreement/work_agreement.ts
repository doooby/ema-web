import { RecordAssociations, recordsQueries } from '~/lib/api2';
import { work_agreement } from '~/lib/records';
import { wai } from '~/vendor/wai';
import { mapAssociation, mapDate } from '~/lib/api2/mappers';
import { controls, FormFieldDefinition } from '~/components/Form';
import { dbFields } from '~/components/database/fields';

export const entity = 'work_agreements';

export function parseRecord (
  value: unknown,
  associations?: RecordAssociations,
): work_agreement.WorkAgreement {
  return wai.object(value => ({
    id: wai.prop('id', value, wai.string),
    country: wai.prop('country_id', value, mapAssociation('countries', associations)),
    person: wai.prop('person_id', value, mapAssociation('people', associations)),
    position: wai.prop('position', value, wai.nullable(wai.string)),
    starts_on: wai.prop('starts_on', value, wai.nullable(mapDate)),
    ends_on: wai.prop('ends_on', value, wai.nullable(mapDate)),
    resigned_on: wai.prop('resigned_on', value, wai.nullable(mapDate)),
    comment: wai.prop('comment', value, wai.nullable(wai.string)),
    created_at: wai.prop('created_at', value, mapDate),
    updated_at: wai.prop('updated_at', value, mapDate),
    archived_at: wai.prop('archived_at', value, wai.nullable(mapDate)),
  }))(value);
}

export const queries = {
  search: recordsQueries.search(entity, parseRecord),
  create: recordsQueries.create(entity),
  update: recordsQueries.update(entity),
};

export function recordControls (): FormFieldDefinition[] {
  return [
    [ 'person', dbFields.selectBRecord, { entity: 'people' } ],
    [ 'position', controls.text ],
    [ 'starts_on', controls.calendar ],
    [ 'ends_on', controls.calendar ],
    [ 'resigned_on', controls.calendar ],
    [ 'comment', controls.textMultiline ],
  ];
}
