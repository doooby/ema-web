import { BRecord, RecordAssociations, recordsQueries } from '~/lib/api2';
import { wai } from '~/vendor/wai';
import { mapAssociation, mapAssociations, mapDate, mapName } from '~/lib/api2/mappers';
import { asFieldType, controls, FormFieldDefinition } from '~/components/Form';
import SchoolYearTerms from '~/components/database/records/schoolYears/SchoolYearTerms/index.vue';
import { application_record, school_year } from '~/lib/records';
import { dbFields } from '~/components/database/fields';

export const entity = 'school_years';

export interface SchoolYear extends application_record.SharedAttributes {
  country: BRecord;
  education_levels?: BRecord[];
  name: string[];
  year_label?: string;
  terms?: { from: Date, to: Date }[];
}

export function parseRecord (
  value,
  associations?: RecordAssociations,
): school_year.SchoolYear {
  return wai.object(value => ({
    ...application_record.parseSharedAttributes(value),
    country: wai.prop('country_id', value, mapAssociation('countries', associations)),
    education_levels: wai.prop('education_levels_ids', value, mapAssociations('education_levels', associations)),
    name: wai.prop('name', value, mapName),
    year_label: wai.prop('year_label', value, wai.nullable(wai.string)),
    terms: wai.prop('terms', value, wai.nullable(wai.listOf(parseTerm))),
  }))(value);
}

function parseTerm (value): { from: Date, to: Date } {
  return wai.object(value => ({
    from: wai.prop('from', value, mapDate),
    to: wai.prop('to', value, mapDate),
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
    [ 'terms', asFieldType(SchoolYearTerms) ],
  ];
}
