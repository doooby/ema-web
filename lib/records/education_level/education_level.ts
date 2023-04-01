import { RecordAssociations, recordsQueries } from '~/lib/api2';
import { wai } from '~/vendor/wai';
import { mapAssociation } from '~/lib/api2/mappers';
import { material_kit } from '~/lib/records';
import { controls, FormFieldDefinition } from '~/components/Form';

export const entity = 'education_levels';

export function parseRecord (
  value: unknown,
  associations?: RecordAssociations,
): material_kit.MaterialKit {
  return wai.object(value => ({
    id: wai.prop('id', value, wai.string),
    country: wai.prop('country_id', value, mapAssociation('countries', associations)),
    name: wai.prop('name', value, wai.listOf(wai.string)),
    level: wai.prop('level', value, wai.integer),
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
    [ 'name', controls.name ],
    [ 'level', controls.integer ],
  ];
}
