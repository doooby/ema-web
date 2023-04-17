import { RecordAssociations, recordsQueries } from '~/lib/api2';
import { application_record, subject } from '~/lib/records';
import { wai } from '~/vendor/wai';
import { mapAssociation, mapAssociations, mapName } from '~/lib/api2/mappers';
import { controls, FormFieldDefinition } from '~/components/Form';
import { dbFields } from '~/components/database/fields';

export const entity = 'subjects';

export function parseRecord (
  value: unknown,
  associations?: RecordAssociations,
): subject.Subject {
  return wai.object(value => ({
    ...application_record.parseSharedAttributes(value),
    country: wai.prop('country_id', value, mapAssociation('countries', associations)),
    name: wai.prop('name', value, mapName),
    education_levels: wai.prop('education_levels_ids', value, mapAssociations('education_levels', associations)),
    categories: wai.prop('categories_ids', value, mapAssociations('subject_categories', associations)),
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
    [ 'name', controls.name ],
    [ 'education_levels', dbFields.selectManyBRecords, { entity: 'education_levels' } ],
    [ 'categories', dbFields.selectManyBRecords, { entity: 'categories' } ],
  ];
}
