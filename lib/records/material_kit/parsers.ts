import { material_kit } from '~/lib/records';
import { wai } from 'wai/lib/wai/index';
export function record (value: unknown, association?: never): material_kit.MaterialKit {
  return wai.object(value => ({
    id: wai.prop('id', value, wai.string),
    name: wai.prop('label', value, wai.listOf(wai.string)),
    code: wai.prop('code', value, wai.nullable(wai.string)),
    contents: wai.prop('contents', value, wai.nullable(wai.string)),
  }))(value);
}
