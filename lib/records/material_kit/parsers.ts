import { material_kit } from '~/lib/records';
import { wai } from '~/vendor/wai';
import { RecordAssociations } from '~/lib/api2';
import { mapAssociation } from '~/lib/api2/mappers';

export function record (
  value: unknown,
  associations?: RecordAssociations,
): material_kit.MaterialKit {
  return wai.object(value => ({
    id: wai.prop('id', value, wai.string),
    country: wai.prop('country_id', value, mapAssociation('countries', associations)),
    name: wai.prop('label', value, wai.listOf(wai.string)),
    code: wai.prop('code', value, wai.nullable(wai.string)),
    contents: wai.prop('contents', value, wai.nullable(wai.string)),
  }))(value);
}
