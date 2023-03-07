import { controls, FormFieldDefinition } from '~/components/Form';
import { RecordAssociations } from '~/lib/api2';
import { donor } from '~/lib/records';
import { wai } from '~/vendor/wai';
import { mapAssociation } from '~/lib/api2/mappers';

export function entityControls (): FormFieldDefinition[] {
  return [
    [ 'name', controls.name ],
    [ 'code', controls.selectMultiple ],
    // [ 'logo', controls.imageFile ], // TODO
  ];
}

export function parseRecord (
  value: unknown,
  associations?: RecordAssociations,
): donor.Donor {
  return wai.object(value => ({
    id: wai.prop('id', value, wai.string),
    country: wai.prop('country_id', value, mapAssociation('countries', associations)),
    name: wai.prop('name', value, wai.listOf(wai.string)),
    code: wai.prop('code', value, wai.nullable(wai.string)),
  }))(value);
}
