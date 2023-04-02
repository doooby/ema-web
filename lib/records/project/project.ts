import { RecordAssociations, recordsQueries } from '~/lib/api2';
import { project } from '~/lib/records';
import { wai } from '~/vendor/wai';
import { mapAssociation, mapDate } from '~/lib/api2/mappers';
import { controls, FormFieldDefinition } from '~/components/Form';
import { dbFields } from '~/components/database/fields';

export const entity = 'projects';

export function parseRecord (
  value: unknown,
  associations?: RecordAssociations,
): project.Project {
  return wai.object(value => ({
    id: wai.prop('id', value, wai.string),
    country: wai.prop('country_id', value, mapAssociation('countries', associations)),
    schools: wai.prop('schools_ids', value, wai.nullable(wai.listOf(mapAssociation('schools', associations)))),
    donors: wai.prop('donors_ids', value, wai.nullable(wai.listOf(mapAssociation('donors', associations)))),
    name: wai.prop('name', value, wai.listOf(wai.string)),
    code: wai.prop('code', value, wai.nullable(wai.string)),
    short_name_en: wai.prop('short_name_en', value, wai.nullable(wai.string)),
    starts_on: wai.prop('starts_on', value, wai.nullable(mapDate)),
    ends_on: wai.prop('ends_on', value, wai.nullable(mapDate)),
  }))(value);
}

export const queries = {
  search: recordsQueries.search(entity, parseRecord),
  searchB: recordsQueries.searchB(entity),
  create: recordsQueries.create(entity),
  update: recordsQueries.update(entity),
};

export function entityControls (): FormFieldDefinition[] {
  return [
    [ 'schools', dbFields.selectManyBRecords, { entity: 'schools' } ],
    [ 'donors', dbFields.selectManyBRecords, { entity: 'donors' } ],
    [ 'name', controls.name ],
    [ 'code', controls.text ],
    [ 'short_name_en', controls.text ],
    [ 'starts_on', controls.calendar ],
    [ 'ends_on', controls.calendar ],
  ];
}
