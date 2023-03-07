import { Params, parsers } from '~/lib/api2';
import { donor } from '~/lib/records';

const path = 'donors';

export function search (params: Params) {
  return {
    path: `/${path}`,
    params,
    reducer: parsers.searchResponsePayload(donor.parseRecord),
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
