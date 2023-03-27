import { BRecord, RecordAssociations } from '~/lib/api2';
import { wai } from '~/vendor/wai';
import { mapAssociation, mapDate } from '~/lib/api2/mappers';

export interface SchoolYear {
  id: string;
  country: BRecord;
  education_levels: BRecord[];
  name: string[];
  year_label: string;
  terms: { from: Date, to: Date }[];
}

export function parseRecord (
  value,
  associations?: RecordAssociations,
): SchoolYear {
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
