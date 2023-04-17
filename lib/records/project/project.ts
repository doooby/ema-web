import { RecordAssociations, recordsQueries } from '~/lib/api2';
import { application_record, project } from '~/lib/records';
import { wai } from '~/vendor/wai';
import { mapAssociation, mapAssociations, mapDate, mapName } from '~/lib/api2/mappers';
import { controls, FormFieldDefinition } from '~/components/Form';
import { dbFields } from '~/components/database/fields';

export const entity = 'projects';

export function parseRecord (
  value: unknown,
  associations?: RecordAssociations,
): project.Project {
  return wai.object(value => ({
    ...application_record.parseSharedAttributes(value),
    country: wai.prop('country_id', value, mapAssociation('countries', associations)),
    schools: wai.prop('schools_ids', value, mapAssociations('schools', associations)),
    donors: wai.prop('donors_ids', value, mapAssociations('donors', associations)),
    name: wai.prop('name', value, mapName),
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

export function recordControls (): FormFieldDefinition[] {
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
