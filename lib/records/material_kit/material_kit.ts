import { BRecord, RecordAssociations } from '~/lib/api2';
import { wai } from '~/vendor/wai';
import { mapAssociation } from '~/lib/api2/mappers';

export interface MaterialKit {
  id: string;
  country: BRecord;
  name: string[];
  code?: string;
  contents?: string;
}

export function parserRecord (
  value: unknown,
  associations?: RecordAssociations,
): MaterialKit {
  return wai.object(value => ({
    id: wai.prop('id', value, wai.string),
    country: wai.prop('country_id', value, mapAssociation('countries', associations)),
    name: wai.prop('name', value, wai.listOf(wai.string)),
    code: wai.prop('code', value, wai.nullable(wai.string)),
    contents: wai.prop('contents', value, wai.nullable(wai.string)),
  }))(value);
}