import { RecordAssociations, recordsQueries } from '~/lib/api2';
import { wai } from '~/vendor/wai';
import { mapAssociation, mapName } from '~/lib/api2/mappers';
import { material_kit } from '~/lib/records';
import { controls, FormFieldDefinition } from '~/components/Form';

export const entity = 'material_kits';

export function parseRecord (
  value: unknown,
  associations?: RecordAssociations,
): material_kit.MaterialKit {
  return wai.object(value => ({
    id: wai.prop('id', value, wai.string),
    country: wai.prop('country_id', value, mapAssociation('countries', associations)),
    name: wai.prop('name', value, mapName),
    code: wai.prop('code', value, wai.nullable(wai.string)),
    contents: wai.prop('contents', value, wai.nullable(wai.string)),
  }))(value);
}

export const queries = {
  search: recordsQueries.search(entity, parseRecord),
  searchB: recordsQueries.searchB(entity),
  create: recordsQueries.create(entity),
  update: recordsQueries.update(entity),
};

export function allControls (): FormFieldDefinition[] {
  return [
    [ 'name', controls.name ],
    [ 'code', controls.text ],
    [ 'contents', controls.textMultiline ],
  ];
}
