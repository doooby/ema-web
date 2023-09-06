import { BRecord, RecordAssociations, recordsQueries } from '~/lib/api2';
import { application_record } from '~/lib/records';
import { wai } from '~/vendor/wai';
import { mapAssociation, mapAssociations, mapDate, mapName } from '~/lib/api2/mappers';
import { controls, FormFieldDefinition } from '~/components/Form';
import { dbFields } from '~/components/database/fields';

export const entity = 'projects';

export interface Project extends application_record.SharedAttributes {
  country: BRecord;
  name: string[];
  full_name?: string[];
  code?: string;
  short_name_en?: string;
  starts_on?: Date;
  ends_on?: Date;
  donors?: BRecord[];
  schools?: BRecord[];
}

export function parseRecord (
  value: unknown,
  associations?: RecordAssociations,
): Project {
  return wai.object(value => ({
    ...application_record.parseSharedAttributes(value),
    country: wai.prop('country_id', value, mapAssociation('countries', associations)),
    schools: wai.prop('school_ids', value, mapAssociations('schools', associations)),
    donors: wai.prop('donor_ids', value, mapAssociations('donors', associations)),
    name: wai.prop('name', value, mapName),
    full_name: wai.prop('full_name', value, wai.nullable(mapName)),
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
    [ 'schools', dbFields.selectManyBRecords, {
      entity: 'schools',
      paramsName: 'school_ids',
    } ],
    [ 'donors', dbFields.selectManyBRecords, {
      entity: 'donors',
      paramsName: 'donor_ids',
    } ],
    [ 'name', controls.name ],
    [ 'full_name', controls.name ],
    [ 'code', controls.text ],
    [ 'short_name_en', controls.text ],
    [ 'starts_on', controls.calendar ],
    [ 'ends_on', controls.calendar ],
  ];
}
