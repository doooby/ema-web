import { BRecord, RecordAssociations, recordsQueries } from '~/lib/api2';
import { application_record, subject_category } from '~/lib/records/index';
import { wai } from '~/vendor/wai';
import { mapAssociation, mapName } from '~/lib/api2/mappers';
import { controls, FormFieldDefinition } from '~/components/Form';

export const entity = 'subject_categories';

export interface SubjectCategory extends application_record.SharedAttributes {
  country: BRecord;
  name: string[];
}

export function parseRecord (
  value: unknown,
  associations?: RecordAssociations,
): subject_category.SubjectCategory {
  return wai.object(value => ({
    ...application_record.parseSharedAttributes(value),
    country: wai.prop('country_id', value, mapAssociation('countries', associations)),
    name: wai.prop('name', value, mapName),
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
  ];
}
