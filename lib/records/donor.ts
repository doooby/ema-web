import { controls, FormFieldDefinition } from '~/components/Form';
import { BRecord, RecordAssociations, recordsQueries } from '~/lib/api2';
import { application_record, donor } from '~/lib/records';
import { wai } from '~/vendor/wai';
import { mapAssociation, mapName } from '~/lib/api2/mappers';

export const entity = 'donors';

export interface Donor extends application_record.SharedAttributes {
  country: BRecord;
  name: string[];
  code?: string;
}

export function parseRecord (
  value: unknown,
  associations?: RecordAssociations,
): donor.Donor {
  return wai.object(value => ({
    ...application_record.parseSharedAttributes(value),
    country: wai.prop('country_id', value, mapAssociation('countries', associations)),
    name: wai.prop('name', value, mapName),
    code: wai.prop('code', value, wai.nullable(wai.string)),
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
    [ 'code', controls.text ],
  ];
}
