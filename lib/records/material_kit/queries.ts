import { Params, parsers } from '~/lib/api2';
import { material_kit } from '~/lib/records';

const path = 'material_kits';

export function search (params: Params) {
  return {
    path: `/${path}`,
    params,
    reducer: parsers.searchResponsePayload(material_kit.parserRecord),
  };
}

export function create (record: Params) {
  return {
    path: `/${path}/create`,
    params: { record },
    reducer: parsers.updatedRecordResponsePayload(),
  };
}

export function update (id: string, record: Params) {
  return {
    path: `/${path}/${id}/update`,
    params: { record },
    reducer: parsers.updatedRecordResponsePayload(),
  };
}
