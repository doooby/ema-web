import { RecordAssociations, recordsQueries } from '~/lib/api2';
import { wai } from '~/vendor/wai';
import { mapAssociation, mapDate } from '~/lib/api2/mappers';
import { asFieldType, controls, FormFieldDefinition } from '~/components/Form';
import AbbreviatedRecordsField from '~/components/database/AbbreviatedRecordsField.vue';
import SchoolYearTerms from '~/components/database/records/schoolYears/SchoolYearTerms/index.vue';
import { school_year } from '~/lib/records';

export const entity = 'school_years';

export function parseRecord (
  value,
  associations?: RecordAssociations,
): school_year.SchoolYear {
  return wai.object(value => ({
    id: wai.prop('id', value, wai.string),
    country: wai.prop('country_id', value, mapAssociation('countries', associations)),
    education_levels: wai.prop('education_levels', value, wai.listOf(mapAssociation('education_levels', associations))),
    name: wai.prop('name', value, wai.listOf(wai.string)),
    year_label: wai.prop('year_label', value, wai.string),
    terms: wai.prop('terms', value, wai.listOf(parseTerm)),
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
  create: recordsQueries.create(entity),
  update: recordsQueries.update(entity),
};

export function allControls (): FormFieldDefinition[] {
  return [
    [ 'name', controls.name ],
    [ 'education_levels', asFieldType(AbbreviatedRecordsField), {
      entity: 'education_levels',
    } ],
    [ 'terms', asFieldType(SchoolYearTerms) ],
  ];
}
