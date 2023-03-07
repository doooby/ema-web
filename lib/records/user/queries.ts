import { Params, parsers } from '~/lib/api2';
import { user } from '~/lib/records';

const path = 'users';

export function search (params: Params) {
  return {
    path: `/${path}`,
    params,
    reducer: parsers.searchResponsePayload(user.parseRecord),
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

export function changePassword (id: number, password: string) {
  return {
    path: `/${path}/${id}/change_password`,
    params: { password },
    reducer: parsers.updatedRecordResponsePayload(),
  };
}

export function lock (
  id: number,
  params: { lock: boolean, wipe_password: boolean },
) {
  return {
    path: `/${path}/${id}/lock`,
    params,
    reducer: parsers.updatedRecordResponsePayload(),
  };
}
