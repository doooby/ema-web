import { Params, RecordAssociations } from '~/lib/api2/types';
import { parsers } from '~/lib/api2/index';
import { bRecordMapper } from '~/lib/api2/parsers';
import { wai } from '~/vendor/wai';
import { api } from '~/lib/api2/module';

export function search<R> (
  path: string,
  parseRecord: (value: unknown, associations?: RecordAssociations) => R,
) {
  return function search (params: Params) {
    return {
      path: `/${path}`,
      params,
      reducer: parsers.searchResponsePayload(parseRecord),
    };
  };
}

export function searchB (
  path: string,
) {
  return function search (params: Params) {
    return {
      path: `/${path}`,
      params: { ...params, b_record: '1' },
      reducer: parsers.searchResponsePayload(bRecordMapper()),
    };
  };
}

export function create (
  path: string,
) {
  return function create (record: Params) {
    return {
      path: `/${path}/create`,
      params: { record },
      reducer: parsers.updatedRecordResponsePayload(),
    };
  };
}

export function update (
  path: string,
) {
  return function update (id: string, record: Params) {
    return {
      path: `/${path}/${id}/update`,
      params: { record },
      reducer: parsers.updatedRecordResponsePayload(),
    };
  };
}

export function v3Show<R = unknown> (
  path: string,
  parseRecord: (value: unknown, associations: wai.Associations) => R,
) {
  return function show ({ id, slices }: api.Params) {
    return {
      pathIsFull: true,
      path: `/v3/${path}`,
      params: { id, slices, per_page: 1 },
      reducer: value => wai.recordShow(value, parseRecord),
    };
  };
}
