import { BRecord, RecordAssociations, recordsQueries } from '~/lib/api2';
import { wai } from '~/vendor/wai';
import { mapAssociation, mapName } from '~/lib/api2/mappers';
import { education_level, application_record } from '~/lib/records/index';
import { controls, FormFieldDefinition } from '~/components/Form';

export const entity = 'education_levels';

export interface EducationLevel extends application_record.SharedAttributes {
  country: BRecord;
  name: string[];
  level: number;
}

export function parseRecord (
  value: unknown,
  associations?: RecordAssociations,
): education_level.EducationLevel {
  return wai.object(value => ({
    ...application_record.parseSharedAttributes(value),
    country: wai.prop('country_id', value, mapAssociation('countries', associations)),
    name: wai.prop('name', value, mapName),
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
